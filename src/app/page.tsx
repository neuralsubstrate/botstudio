import { Craft } from "@/components/Craft";
import { Hero } from "@/components/Hero";
import { HowWeWork } from "@/components/HowWeWork";
import { Manifesto } from "@/components/Manifesto";
import { Pricing } from "@/components/Pricing";
import { Services } from "@/components/Services";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Craft />
      <Services />
      <HowWeWork />
      <Pricing />
    </>
  );
}
