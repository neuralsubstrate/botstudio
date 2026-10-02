import { Craft } from "@/components/Craft";
import { Hero } from "@/components/Hero";
import { HowWeWork } from "@/components/HowWeWork";
import { Manifesto } from "@/components/Manifesto";
import { Pricing } from "@/components/Pricing";
import { ProcessFilm } from "@/components/ProcessFilm";
import { Services } from "@/components/Services";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProcessFilm />
      <Manifesto />
      <Craft />
      <Services />
      <HowWeWork />
      <Pricing />
    </>
  );
}
