// The process scene: "a website assembling itself", drawn live with three.js
// and driven by scroll. Pieces of a site float as clay, line up as wireframe
// layers on a grid, take on colour and images, then lock together; the cursor
// clicks and the Studios icon flashes. Scrolling up plays it backwards.
//
// Plain JS on purpose: it is a self-contained WebGL program, and the page only
// loads it (with three) when the visitor nears the section.
import * as THREE from "three"

const SANS = `Inter, "Inter Placeholder", "Helvetica Neue", Arial, sans-serif`
const MONO = `"Fragment Mono", "JetBrains Mono", ui-monospace, Menlo, monospace`

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (a, b, v) => {
    const t = clamp((v - a) / (b - a))
    return t * t * (3 - 2 * t)
}
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const lerp = (a, b, t) => a + (b - a) * t

// Seeded random, so the scattered layout is the same on every visit.
function rng(seed) {
    let s = seed >>> 0
    return () => {
        s = (s + 0x6d2b79f5) >>> 0
        let t = s
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// A rounded slab with real thickness. UVs are remapped to 0..1 across the face
// so an image or a canvas texture covers the front exactly.
function slab(w, h, d, r) {
    r = Math.min(r, w / 2, h / 2)
    const s = new THREE.Shape()
    const x = -w / 2
    const y = -h / 2
    s.moveTo(x + r, y)
    s.lineTo(x + w - r, y)
    s.quadraticCurveTo(x + w, y, x + w, y + r)
    s.lineTo(x + w, y + h - r)
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    s.lineTo(x + r, y + h)
    s.quadraticCurveTo(x, y + h, x, y + h - r)
    s.lineTo(x, y + r)
    s.quadraticCurveTo(x, y, x + r, y)
    const bevel = Math.min(r * 0.5, d * 0.35, 0.07)
    const g = new THREE.ExtrudeGeometry(s, {
        depth: d,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 3,
        curveSegments: 10,
    })
    g.translate(0, 0, -d / 2)
    const pos = g.attributes.position
    const uv = g.attributes.uv
    for (let i = 0; i < pos.count; i++) {
        uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h)
    }
    g.computeVertexNormals()
    return g
}

function canvasTexture(w, h, draw) {
    const c = document.createElement("canvas")
    c.width = w
    c.height = h
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    const paint = () => {
        const ctx = c.getContext("2d")
        ctx.save()
        ctx.clearRect(0, 0, w, h)
        draw(ctx, w, h)
        ctx.restore()
        tex.needsUpdate = true
    }
    paint()
    return { tex, paint }
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
}

// Wrap text to a width, returning the lines.
function wrap(ctx, text, maxW) {
    const words = String(text).split(/\s+/)
    const lines = []
    let line = ""
    for (const word of words) {
        const next = line ? line + " " + word : word
        if (ctx.measureText(next).width > maxW && line) {
            lines.push(line)
            line = word
        } else line = next
    }
    if (line) lines.push(line)
    return lines
}

// Placeholder art for image slots left empty in the Framer panel.
function placeholderArt(seed, accent) {
    return canvasTexture(1024, 680, (ctx, w, h) => {
        const r = rng(seed)
        const g = ctx.createLinearGradient(0, 0, w, h)
        g.addColorStop(0, "#1c1e22")
        g.addColorStop(1, "#0b0c0e")
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
        for (let i = 0; i < 6; i++) {
            const cx = r() * w
            const cy = r() * h
            const rad = 80 + r() * 260
            const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
            rg.addColorStop(0, i % 3 === 0 ? accent : "#3a3d44")
            rg.addColorStop(1, "rgba(0,0,0,0)")
            ctx.globalAlpha = 0.55
            ctx.fillStyle = rg
            ctx.fillRect(0, 0, w, h)
        }
        ctx.globalAlpha = 1
    })
}

// Crop a texture to fill a face of the given aspect, like object-fit: cover.
function cover(tex, imgAspect, faceAspect) {
    if (imgAspect > faceAspect) {
        tex.repeat.set(faceAspect / imgAspect, 1)
        tex.offset.set((1 - faceAspect / imgAspect) / 2, 0)
    } else {
        tex.repeat.set(1, imgAspect / faceAspect)
        tex.offset.set(0, (1 - imgAspect / faceAspect) / 2)
    }
}

// Camera path: [progress, position, look-at].
const CAMERA = [
    [0.0, [0, 1.5, 38], [0, 0, 0]],
    [0.22, [-2, 2.5, 33], [0, 0, 0]],
    [0.44, [-17, 10, 22], [0, 0, 1.5]],
    [0.62, [-10, 5, 22.5], [0, 0, 0.8]],
    [0.8, [-2.4, 1.4, 21], [0, 0, 0.3]],
    [1.0, [0, 0.2, 20.5], [0, 0, 0]],
]

function cameraAt(p) {
    let i = 0
    while (i < CAMERA.length - 2 && p > CAMERA[i + 1][0]) i++
    const [p0, a, ta] = CAMERA[i]
    const [p1, b, tb] = CAMERA[i + 1]
    const t = ease(clamp((p - p0) / (p1 - p0)))
    return {
        pos: [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)],
        look: [lerp(ta[0], tb[0], t), lerp(ta[1], tb[1], t), lerp(ta[2], tb[2], t)],
    }
}

const FLASH_AT = 0.86
// When the real button takes over from the 3D one.
const CTA_AT = 0.95
// Scroll, in screen heights, that holds the finished page at the end.
const HOLD = 0.8

/**
 * Mounts the scene. Returns a cleanup function.
 * @param {{ track: HTMLElement, mount: HTMLElement, flash: HTMLElement, images: string[],
 *   onCta?: (rect: { x: number, y: number, w: number, h: number } | null) => void }} opts
 *   track: the tall scroll section that drives progress; mount: where the
 *   canvas goes; flash: an overlay for the launch flash; onCta: told where the
 *   3D "Let's chat" button sits on screen (in mount pixels) once the page has
 *   locked together, and null before that, so a real button can sit over it.
 */
export function mountProcessScene({ track: wrapEl, mount, flash, images, onCta }) {
    const theme = "Dark"
    const accent = "#0077E6"
    const background = "#161719"
    const textColor = "#d0d6e0"
    const headline = "Ultra-premium websites that perform."
    const brand = "botLane\\Studios"
    const cta = "Let's chat"
    const smoothing = 0.12
    const isCanvas = false
    const flashRef = { current: flash }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const light = theme === "Light"
    const SURF = light
        ? { page: "#FFFFFF", grid: "rgba(0,0,0,0.045)", bar: "#F2F4F7", pill: "#E6E9EE", muted: "#6B7280", dot: "#D3D8DF", panel: "#FFFFFF", ghostLine: "rgba(0,0,0,0.22)", line: 0x0a0a0a }
        : { page: "#0f1012", grid: "rgba(255,255,255,0.035)", bar: "#191b1f", pill: "#24262b", muted: "#a3a8b0", dot: "#3a3d44", panel: "#0f1012", ghostLine: "rgba(255,255,255,0.35)", line: 0xffffff }

    // ---------- renderer, scene, camera ----------
    // Transparent: the pieces sit straight on the section's own background.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    const coarse = window.matchMedia?.("(pointer: coarse)").matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 2 : 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = theme === "Light" ? THREE.NeutralToneMapping : THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = light ? 0.92 : 1.05
    if (light) {
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = "block"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(new THREE.Color(background), 34, 80)
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200)

    // Soft studio reflections without loading an HDR file.
    const pmrem = new THREE.PMREMGenerator(renderer)
    const env = new THREE.Scene()
    env.add(new THREE.Mesh(new THREE.SphereGeometry(50, 16, 8), new THREE.MeshBasicMaterial({ color: light ? 0x8a9099 : 0x1a1b1e, side: THREE.BackSide })))
    const softbox = (x, y, z, w, h, k) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide }))
        m.position.set(x, y, z)
        m.lookAt(0, 0, 0)
        env.add(m)
    }
    softbox(0, 22, 10, 30, 12, 3.2)
    softbox(-26, 6, 6, 10, 20, 1.6)
    softbox(26, 2, -10, 10, 18, 1.1)
    const envTex = pmrem.fromScene(env, 0.04).texture
    scene.environment = envTex

    scene.add(light ? new THREE.HemisphereLight(0xffffff, 0xc9d2dc, 0.55) : new THREE.HemisphereLight(0xffffff, 0x101012, 0.55))
    const key = new THREE.DirectionalLight(0xffffff, light ? 1.25 : 1.6)
    // On white the key sits nearer the camera, so shadows fall just behind the pieces.
    if (light) key.position.set(5, 9, 22)
    else key.position.set(8, 14, 16)
    if (light) {
        key.castShadow = true
        key.shadow.mapSize.set(2048, 2048)
        key.shadow.radius = 6
        key.shadow.bias = -0.0005
        const sc = key.shadow.camera
        sc.left = -40; sc.right = 40; sc.top = 30; sc.bottom = -30; sc.near = 1; sc.far = 90
    }
    scene.add(key)
    const rim = new THREE.DirectionalLight(new THREE.Color(accent), light ? 0.5 : 1.2)
    rim.position.set(-12, 5, -10)
    scene.add(rim)
    const flashLight = new THREE.PointLight(0xffffff, 0, 22, 1.6)
    scene.add(flashLight)

    const root = new THREE.Group()
    scene.add(root)

    const disposables = []
    const track = (x) => (disposables.push(x), x)

    // ---------- textures ----------
    const accentHex = new THREE.Color(accent).getStyle()
    const ac = new THREE.Color(accent)
    const accentRgba = (a) => `rgba(${Math.round(ac.r * 255)},${Math.round(ac.g * 255)},${Math.round(ac.b * 255)},${a})`
    const fg = textColor

    const windowTex = canvasTexture(1600, 1000, (ctx, w, h) => {
        ctx.fillStyle = SURF.page
        ctx.fillRect(0, 0, w, h)
        ctx.strokeStyle = SURF.grid
        ctx.lineWidth = 2
        for (let x = 0; x <= w; x += 80) {
            ctx.beginPath(); ctx.moveTo(x, 70); ctx.lineTo(x, h); ctx.stroke()
        }
        for (let y = 70; y <= h; y += 80) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
        }
        ctx.fillStyle = SURF.bar
        ctx.fillRect(0, 0, w, 70)
        ;["#ff5f57", SURF.dot, SURF.dot].forEach((c, i) => {
            ctx.fillStyle = i === 0 ? accentHex : c
            ctx.beginPath(); ctx.arc(44 + i * 34, 35, 10, 0, Math.PI * 2); ctx.fill()
        })
        roundRect(ctx, w / 2 - 220, 17, 440, 36, 18)
        ctx.fillStyle = SURF.pill
        ctx.fill()
        ctx.fillStyle = SURF.muted
        ctx.font = `500 20px ${SANS}`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("botlane.studios", w / 2, 36)
    })
    track(windowTex.tex)

    const navTex = canvasTexture(2048, 88, (ctx, w, h) => {
        ctx.fillStyle = light ? "#FFFFFF" : "#16181b"
        ctx.fillRect(0, 0, w, h)
        ctx.textBaseline = "middle"
        ctx.font = `600 40px ${SANS}`
        let x = 40
        const parts = String(brand).split("\\")
        const draw = (t, c) => {
            ctx.fillStyle = c
            ctx.fillText(t, x, h / 2 + 1)
            x += ctx.measureText(t).width
        }
        draw(parts[0], fg)
        if (parts.length > 1) {
            x += 10
            draw("\\", accentHex)
            x += 10
            draw(parts.slice(1).join("\\"), fg)
        }
        ctx.font = `500 26px ${MONO}`
        ctx.fillStyle = SURF.muted
        ctx.textAlign = "right"
        ctx.fillText("STUDIO     PROCESS     PRICING     CONTACT", w - 330, h / 2 + 1)
        roundRect(ctx, w - 290, 14, 250, h - 28, (h - 28) / 2)
        ctx.fillStyle = fg
        ctx.fill()
        ctx.fillStyle = background
        ctx.textAlign = "center"
        ctx.font = `600 26px ${SANS}`
        ctx.fillText(String(cta).toUpperCase(), w - 165, h / 2 + 1)
    })
    track(navTex.tex)

    const headTex = canvasTexture(1480, 520, (ctx, w, h) => {
        ctx.fillStyle = SURF.panel
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = fg
        ctx.font = `600 112px ${SANS}`
        ctx.textBaseline = "alphabetic"
        const lines = wrap(ctx, headline, w - 40).slice(0, 3)
        lines.forEach((l, i) => ctx.fillText(l, 12, 118 + i * 124))
        ctx.fillStyle = accentHex
        ctx.fillRect(14, h - 26, 120, 6)
    })
    track(headTex.tex)

    const ctaTex = canvasTexture(540, 164, (ctx, w, h) => {
        ctx.fillStyle = accentHex
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = "#ffffff"
        ctx.font = `600 54px ${SANS}`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${cta} →`, w / 2, h / 2 + 2)
    })
    track(ctaTex.tex)

    const ghostTex = canvasTexture(540, 164, (ctx, w, h) => {
        ctx.fillStyle = light ? "#FFFFFF" : "#121316"
        ctx.fillRect(0, 0, w, h)
        ctx.strokeStyle = SURF.ghostLine
        ctx.lineWidth = 6
        roundRect(ctx, 6, 6, w - 12, h - 12, (h - 12) / 2)
        ctx.stroke()
        ctx.fillStyle = fg
        ctx.font = `500 46px ${MONO}`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("OUR PROCESS", w / 2, h / 2 + 2)
    })
    track(ghostTex.tex)

    // Fonts may land after the first paint; repaint the text once they do.
    document.fonts?.ready?.then(() => [navTex, headTex, ctaTex, ghostTex, windowTex].forEach((t) => t.paint()))

    // ---------- pieces ----------
    // final: assembled position. layer: depth in the exploded (wireframe) view.
    const SPEC = [
        { id: "window", w: 16, h: 10, d: 0.32, r: 0.6, tex: windowTex.tex, final: [0, 0, 0], layer: -1 },
        { id: "nav", w: 14.6, h: 0.63, d: 0.14, r: 0.3, tex: navTex.tex, final: [0, 3.55, 0.34], layer: 0 },
        { id: "headline", w: 7.4, h: 2.6, d: 0.14, r: 0.22, tex: headTex.tex, final: [-3.6, 1.45, 0.34], layer: 1 },
        { id: "hero", w: 6.7, h: 4.4, d: 0.22, r: 0.34, img: 0, final: [3.85, 1.05, 0.42], layer: 1 },
        { id: "cta", w: 2.7, h: 0.82, d: 0.24, r: 0.41, tex: ctaTex.tex, final: [-5.95, -0.75, 0.5], layer: 2, accentClay: true },
        { id: "ghost", w: 2.7, h: 0.82, d: 0.2, r: 0.41, tex: ghostTex.tex, final: [-3.05, -0.75, 0.45], layer: 2 },
        { id: "card1", w: 4.6, h: 2.6, d: 0.18, r: 0.3, img: 1, final: [-5.05, -3.35, 0.4], layer: 0 },
        { id: "card2", w: 4.6, h: 2.6, d: 0.18, r: 0.3, img: 2, final: [0, -3.35, 0.4], layer: 1 },
        { id: "card3", w: 4.6, h: 2.6, d: 0.18, r: 0.3, img: 3, final: [5.05, -3.35, 0.4], layer: 2 },
    ]

    const R = rng(7)
    const pieces = []
    const clay = new THREE.Color(light ? "#e3e5e9" : "#d8d5ce")
    const clayAccent = new THREE.Color(accent)
    const white = new THREE.Color("#ffffff")

    const imgList = (images || []).map((i) => (i && (i.src || i)) || "")

    function makeMaterial(map, accentClay) {
        const m = new THREE.MeshPhysicalMaterial({
            color: accentClay ? clayAccent : clay,
            roughness: 0.5,
            metalness: 0,
            clearcoat: light ? 0.15 : 0.5,
            clearcoatRoughness: 0.3,
            envMapIntensity: light ? 0.45 : 1,
            map,
            transparent: true,
        })
        // uTex blends the clay colour (0) into the texture (1).
        m.userData.uTex = { value: 0 }
        m.onBeforeCompile = (shader) => {
            shader.uniforms.uTex = m.userData.uTex
            shader.fragmentShader =
                "uniform float uTex;\n" +
                shader.fragmentShader.replace(
                    "#include <map_fragment>",
                    `#ifdef USE_MAP
                      vec4 sampledDiffuseColor = texture2D( map, vMapUv );
                      diffuseColor.rgb = mix( diffuseColor.rgb, sampledDiffuseColor.rgb, uTex );
                    #endif`
                )
        }
        return track(m)
    }

    SPEC.forEach((s, i) => {
        const geo = track(slab(s.w, s.h, s.d, s.r))
        let map = s.tex
        if (s.img !== undefined) {
            const ph = placeholderArt(11 + s.img * 7, accentHex)
            track(ph.tex)
            cover(ph.tex, 1024 / 680, s.w / s.h)
            map = ph.tex
            const src = imgList[s.img]
            if (src) {
                const im = new Image()
                im.crossOrigin = "anonymous"
                im.onload = () => {
                    const t = track(new THREE.Texture(im))
                    t.colorSpace = THREE.SRGBColorSpace
                    t.anisotropy = 4
                    t.needsUpdate = true
                    cover(t, im.naturalWidth / im.naturalHeight, s.w / s.h)
                    mesh.material.map = t
                    mesh.material.needsUpdate = true
                }
                im.src = src
            }
        }
        const mat = makeMaterial(map, s.accentClay)
        const mesh = new THREE.Mesh(geo, mat)
        const edges = new THREE.LineSegments(
            track(new THREE.EdgesGeometry(geo, 25)),
            track(new THREE.LineBasicMaterial({ color: SURF.line, transparent: true, opacity: 0 }))
        )
        mesh.castShadow = light
        const group = new THREE.Group()
        group.add(mesh, edges)
        root.add(group)

        const far = s.id === "window"
        const scatter = far
            ? new THREE.Vector3(2, -1, -16)
            : new THREE.Vector3((R() - 0.5) * 30, (R() - 0.5) * 17, (R() - 0.5) * 16 - 2)
        const scatterRot = new THREE.Quaternion().setFromEuler(
            far ? new THREE.Euler(-0.35, 0.5, 0.1) : new THREE.Euler((R() - 0.5) * 2.4, (R() - 0.5) * 2.8, (R() - 0.5) * 1.6)
        )
        const final = new THREE.Vector3(...s.final)
        const exploded = new THREE.Vector3(s.final[0] * 1.06, s.final[1] * 1.06, s.layer * 2.6)
        pieces.push({ s, i, group, mesh, edges, scatter, scatterRot, final, exploded, phase: R() * Math.PI * 2 })
    })

    // The Studios icon: red plate, dark slot, white lamp. It flashes at launch.
    const icon = new THREE.Group()
    const plateMat = track(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(accent), roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.15 }))
    const plate = new THREE.Mesh(track(slab(1.9, 1.9, 0.55, 0.52)), plateMat)
    plate.castShadow = light
    const slotMat = track(new THREE.MeshPhysicalMaterial({ color: 0x0a0b0d, roughness: 0.25, clearcoat: 1 }))
    const slot = new THREE.Mesh(track(slab(1.22, 0.44, 0.12, 0.22)), slotMat)
    slot.position.z = 0.3
    const lampMat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6, roughness: 0.2 }))
    const lamp = new THREE.Mesh(track(new THREE.SphereGeometry(0.15, 24, 16)), lampMat)
    lamp.position.set(-0.33, 0, 0.38)
    const eye = new THREE.Group()
    eye.add(slot, lamp)
    icon.add(plate, eye)
    root.add(icon)
    const iconScatter = new THREE.Vector3(6, 3.5, 9)
    const iconExploded = new THREE.Vector3(7.6, 4.6, 7.5)
    const iconFinal = new THREE.Vector3(7.25, 4.25, 1.35)

    // The cursor: an extruded arrow that ends on the call-to-action.
    const arrow = new THREE.Shape()
    ;[[0, 0], [0, -1.1], [0.3, -0.82], [0.52, -1.28], [0.7, -1.2], [0.48, -0.76], [0.86, -0.76]].forEach(([x, y], k) =>
        k ? arrow.lineTo(x, y) : arrow.moveTo(x, y)
    )
    arrow.closePath()
    const cursorGeo = track(new THREE.ExtrudeGeometry(arrow, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 }))
    const cursor = new THREE.Mesh(cursorGeo, track(new THREE.MeshPhysicalMaterial({ color: light ? 0x111214 : 0xffffff, roughness: 0.3, clearcoat: 1 })))
    cursor.castShadow = light
    root.add(cursor)
    const cursorFrom = new THREE.Vector3(9, -7, 8)
    const cursorTo = new THREE.Vector3(-5.2, -0.82, 1.25)

    // Loose shapes that make the opening feel like a studio table.
    const confetti = []
    const shapes = [
        () => new THREE.SphereGeometry(0.42, 32, 16),
        () => new THREE.TorusGeometry(0.42, 0.14, 16, 48),
        () => slab(0.8, 0.8, 0.8, 0.2),
        () => new THREE.CylinderGeometry(0.32, 0.32, 0.9, 32),
    ]
    const palette = light ? [accent, "#ffffff", "#111214", "#c9ced6"] : [accent, "#f4f3ef", "#2a2d33", "#a3a8b0"]
    for (let k = 0; k < 14; k++) {
        const geo = track(shapes[k % shapes.length]())
        const m = track(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(palette[k % palette.length]), roughness: 0.4, clearcoat: 0.8 }))
        const mesh = new THREE.Mesh(geo, m)
        mesh.castShadow = light
        const home = new THREE.Vector3((R() - 0.5) * 34, (R() - 0.5) * 20, (R() - 0.5) * 14)
        confetti.push({ mesh, home, spin: new THREE.Vector3(R(), R(), R()).multiplyScalar(0.6), phase: R() * 6 })
        root.add(mesh)
    }

    // The strategy grid behind the layers.
    const gridGeo = new THREE.BufferGeometry()
    const gv = []
    for (let x = -70; x <= 70; x += 2) gv.push(x, -46, 0, x, 46, 0)
    for (let y = -46; y <= 46; y += 2) gv.push(-70, y, 0, 70, y, 0)
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gv, 3))
    const gridMat = track(new THREE.LineBasicMaterial({ color: SURF.line, transparent: true, opacity: 0 }))
    const grid = new THREE.LineSegments(track(gridGeo), gridMat)
    grid.position.z = -3.4
    root.add(grid)

    // On white, a soft shadow catcher behind the pieces gives them depth.
    if (light) {
        const catcher = new THREE.Mesh(track(new THREE.PlaneGeometry(220, 150)), track(new THREE.ShadowMaterial({ opacity: 0.07 })))
        catcher.position.z = -2.6
        catcher.receiveShadow = true
        root.add(catcher)
    }

    // ---------- layout ----------
    // Centred. Wide screens frame the page in ~82% of the width; tall ones
    // fit it to the width.
    let fit = 1
    const pan = new THREE.Vector2()
    const resize = () => {
        const w = mount.clientWidth || 1
        const h = mount.clientHeight || 1
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
        const tanH = tanV * camera.aspect
        const wide = camera.aspect > 1.15
        const usableW = wide ? 0.82 : 0.86
        const usableH = wide ? 0.86 : 0.62
        const need = Math.max(17.5 / 2 / (tanH * usableW), 11.5 / 2 / (tanV * usableH))
        fit = need / 20.5
        pan.set(0, 0)
        // Fog is tuned for desktop distance; scale it with the camera.
        scene.fog.near = 34 * fit
        scene.fog.far = 80 * fit
        camera.far = 200 * fit
        camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(mount)
    resize()

    // ---------- scroll + pointer ----------
    let target = isCanvas ? 1 : 0
    let current = target
    const readScroll = () => {
        if (isCanvas) return
        // The last HOLD screen-heights of the track are a pause: the finished
        // page (and the real button over it) stays pinned before moving on.
        const r = wrapEl.getBoundingClientRect()
        const total = r.height - window.innerHeight - HOLD * window.innerHeight
        target = total > 0 ? clamp(-r.top / total) : 0
    }
    readScroll()
    current = target
    window.addEventListener("scroll", readScroll, { passive: true })
    window.addEventListener("resize", readScroll)

    let mx = 0
    let my = 0
    const onPointer = (e) => {
        mx = (e.clientX / window.innerWidth) * 2 - 1
        my = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("pointermove", onPointer, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "200px" })
    io.observe(wrapEl)

    // ---------- frame ----------
    let flashStart = -1
    let lastP = current
    let last = performance.now()
    let raf = 0
    const tmp = new THREE.Vector3()
    const ident = new THREE.Quaternion()
    const tau = Math.max(0, smoothing)

    // Where the 3D call-to-action sits on screen: its front face's corners,
    // projected. Reported only when it moves, so the page does little work.
    const ctaPiece = pieces.find((pc) => pc.s.id === "cta")
    const corner = new THREE.Vector3()
    let ctaKey = ""
    const reportCta = (p) => {
        if (!onCta || !ctaPiece) return
        if (p < CTA_AT) {
            if (ctaKey !== "none") onCta(null)
            ctaKey = "none"
            return
        }
        const { w: cw, h: ch, d: cd } = ctaPiece.s
        const w = mount.clientWidth
        const h = mount.clientHeight
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
        for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
            corner.set((sx * cw) / 2, (sy * ch) / 2, cd / 2)
            ctaPiece.mesh.localToWorld(corner).project(camera)
            const px = (corner.x * 0.5 + 0.5) * w
            const py = (-corner.y * 0.5 + 0.5) * h
            x0 = Math.min(x0, px); x1 = Math.max(x1, px)
            y0 = Math.min(y0, py); y1 = Math.max(y1, py)
        }
        const rect = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
        const key = [rect.x, rect.y, rect.w, rect.h].map((v) => Math.round(v * 2)).join()
        if (key === ctaKey) return
        ctaKey = key
        onCta(rect)
    }

    const frame = (now) => {
        raf = requestAnimationFrame(frame)
        const dt = Math.min(0.1, (now - last) / 1000)
        last = now
        if (!visible) return
        readScroll()
        current = tau > 0 ? current + (target - current) * (1 - Math.exp(-dt / tau)) : target
        const p = current
        const t = now / 1000
        const idle = reduce ? 0 : 1

        // Shutter flash when the page locks in (scrolling down only).
        if (lastP < FLASH_AT && p >= FLASH_AT && !isCanvas) flashStart = now
        if (p < FLASH_AT - 0.05) flashStart = -1
        lastP = p

        const wire = smooth(0.2, 0.34, p) * (1 - smooth(0.5, 0.66, p))
        const texMix = smooth(0.54, 0.74, p)

        for (const pc of pieces) {
            const a = ease(smooth(0.08 + pc.i * 0.012, 0.36 + pc.i * 0.012, p))
            const b = ease(smooth(0.5 + pc.i * 0.01, 0.74 + pc.i * 0.01, p))
            tmp.copy(pc.scatter).lerp(pc.exploded, a).lerp(pc.final, b)
            const float = (1 - b) * idle
            tmp.y += Math.sin(t * 0.8 + pc.phase) * 0.35 * float
            tmp.x += Math.cos(t * 0.6 + pc.phase) * 0.2 * float
            pc.group.position.copy(tmp)
            pc.group.quaternion.slerpQuaternions(pc.scatterRot, ident, a)
            const m = pc.mesh.material
            const solid = 1 - 0.88 * wire
            m.opacity = solid
            m.depthWrite = solid > 0.95
            m.userData.uTex.value = texMix
            m.color.copy(pc.s.accentClay ? clayAccent : clay).lerp(white, texMix)
            pc.edges.material.opacity = wire * 0.9
        }
        gridMat.opacity = wire * (light ? 0.14 : 0.22)

        // Icon.
        const ia = ease(smooth(0.1, 0.38, p))
        const ib = ease(smooth(0.6, 0.84, p))
        icon.position.copy(iconScatter).lerp(iconExploded, ia).lerp(iconFinal, ib)
        icon.position.y += Math.sin(t * 0.9) * 0.3 * (1 - ib) * idle
        icon.rotation.set(
            lerp(0.5, 0, ia) + Math.sin(t * 0.7) * 0.08 * (1 - ib) * idle,
            lerp(-0.9, -0.25, ia) * (1 - ib) + Math.sin(t * 0.5) * 0.06 * idle * (1 - ib),
            lerp(0.3, 0, ia)
        )
        icon.scale.setScalar(lerp(1.5, 1, ib))

        // Shutter: slot snaps shut, then the lamp flashes.
        let shut = 1
        let flash = 0
        if (flashStart >= 0) {
            const ms = now - flashStart
            if (ms < 70) shut = lerp(1, 0.06, ms / 70)
            else if (ms < 140) shut = 0.06
            else if (ms < 300) shut = lerp(0.06, 1, (ms - 140) / 160)
            if (ms > 140 && ms < 900) flash = ms < 210 ? (ms - 140) / 70 : Math.max(0, 1 - (ms - 210) / 690)
            if (ms > 1000) flashStart = -2 // done until the next pass
        }
        eye.scale.y = shut
        lampMat.emissiveIntensity = 0.6 + flash * 9
        flashLight.intensity = flash * (light ? 90 : 140)
        icon.getWorldPosition(tmp)
        flashLight.position.set(tmp.x - 0.4, tmp.y, tmp.z + 2)
        if (flashRef.current) {
            tmp.project(camera)
            const at = `circle at ${(tmp.x * 0.5 + 0.5) * 100}% ${(-tmp.y * 0.5 + 0.5) * 100}%`
            flashRef.current.style.opacity = String(flash * (light ? 0.5 : 0.55))
            flashRef.current.style.background = light
                ? `radial-gradient(${at}, ${accentRgba(0.55)}, ${accentRgba(0.16)} 18%, ${accentRgba(0)} 55%)`
                : `radial-gradient(${at}, rgba(255,255,255,0.95), rgba(255,255,255,0.25) 18%, rgba(255,255,255,0) 55%)`
        }

        // Cursor glides in during build and clicks the CTA before the flash.
        const ca = ease(smooth(0.6, 0.82, p))
        cursor.position.copy(cursorFrom).lerp(cursorTo, ca)
        cursor.position.y += Math.sin(ca * Math.PI) * 2.2
        cursor.rotation.set(0, lerp(-0.6, 0, ca), lerp(0.4, 0, ca))
        const click = Math.max(0, 1 - Math.abs(p - 0.835) / 0.012)
        // ...then fades as the real button takes its place.
        const handOff = smooth(CTA_AT - 0.04, CTA_AT, p)
        cursor.scale.setScalar(Math.max(0.0001, lerp(0.0001, 1, smooth(0.56, 0.64, p)) * (1 - 0.18 * click) * (1 - handOff)))

        // Confetti drifts in the opening, then clears out of the way.
        const gone = smooth(0.38, 0.6, p)
        for (const c of confetti) {
            c.mesh.position.copy(c.home).multiplyScalar(1 + gone * 0.9)
            c.mesh.position.y += Math.sin(t * 0.7 + c.phase) * 0.5 * idle
            c.mesh.rotation.set(t * c.spin.x * idle + c.phase, t * c.spin.y * idle, t * c.spin.z * idle)
            c.mesh.scale.setScalar(Math.max(0.0001, 1 - gone))
        }

        // Camera, with a little pointer parallax.
        const cam = cameraAt(p)
        camera.position.set(cam.pos[0] * fit + pan.x, cam.pos[1] * fit + pan.y, cam.pos[2] * fit)
        camera.lookAt(cam.look[0] + pan.x, cam.look[1] + pan.y, cam.look[2])
        root.rotation.y += ((reduce ? 0 : mx * 0.06) - root.rotation.y) * 0.05
        root.rotation.x += ((reduce ? 0 : my * 0.04) - root.rotation.x) * 0.05

        renderer.render(scene, camera)
        reportCta(p)
    }
    raf = requestAnimationFrame(frame)

    return () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        io.disconnect()
        window.removeEventListener("scroll", readScroll)
        window.removeEventListener("resize", readScroll)
        window.removeEventListener("pointermove", onPointer)
        disposables.forEach((d) => d.dispose?.())
        envTex.dispose()
        pmrem.dispose()
        renderer.dispose()
        renderer.domElement.remove()
    }
}
