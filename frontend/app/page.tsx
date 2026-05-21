import { AccordionIntro } from "@/components/AccordionIntro";
import { Hero } from "@/components/Hero";
import { VideoTheater } from "@/components/VideoTheater";

export default function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <AccordionIntro />
      <VideoTheater />

      <footer className="mx-auto max-w-6xl px-6 pb-12 text-center text-xs uppercase tracking-[0.3em] text-ink-faint md:px-10">
        Built by Mitansh Patel for BBTT &middot; Round 1 Submission
      </footer>
    </main>
  );
}
