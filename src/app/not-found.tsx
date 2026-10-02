import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell page-hero">
      <p className="kicker">{"// 404"}</p>
      <h1>Page not found</h1>
      <p>That route doesn&apos;t exist yet — or never will.</p>
      <p style={{ marginTop: 32 }}>
        <Link href="/" className="btn btn-primary">
          Back to studio
        </Link>
      </p>
    </div>
  );
}
