import type { Metadata } from "next";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Favorites",
  description:
    "People and accounts that I follow and look up to.",
  alternates: {
    canonical: "/inspiration",
  },
};

export default async function InspirationPage() {
  const items = [
    {
      title: "Andrej Karpathy",
      description: "AI researcher and educator I admire",
      href: "https://x.com/karpathy",
      src: (
        <img src="https://unavatar.io/x/karpathy" alt="Andrej Karpathy" className="size-full" />
      ),
    },
    {
      title: "Varun",
      description: "Building towards AGI",
      href: "https://x.com/waitin4agi_",
      src: (
        <img src="https://unavatar.io/x/waitin4agi_" alt="Varun" className="size-full" />
      ),
    },
    {
      title: "Kirat",
      description: "Builder and educator in the dev community",
      href: "https://x.com/kirat_tw",
      src: (
        <img src="https://unavatar.io/x/kirat_tw" alt="Kirat" className="size-full" />
      ),
    },
    {
      title: "Ansh Mehra",
      description: "Engineer and creator I look up to",
      href: "https://x.com/AnshMehraaa",
      src: (
        <img src="https://unavatar.io/x/AnshMehraaa" alt="Ansh Mehra" className="size-full" />
      ),
    },
    {
      title: "Solana Foundation",
      description: "Building and growing the Solana ecosystem",
      href: "https://x.com/SolanaFndn",
      src: (
        <img src="https://unavatar.io/x/SolanaFndn" alt="Solana Foundation" className="size-full" />
      ),
    },
    {
      title: "usagimaruma",
      description: "Creative builder I follow for inspiration",
      href: "https://x.com/usagimaruma",
      src: (
        <img src="https://unavatar.io/x/usagimaruma" alt="usagimaruma" className="size-full" />
      ),
    },
    {
      title: "François Chollet",
      description: "Creator of Keras, AI researcher at Google",
      href: "https://x.com/fchollet",
      src: (
        <img src="https://unavatar.io/x/fchollet" alt="François Chollet" className="size-full" />
      ),
    },
    {
      title: "Jeremy Howard",
      description: "Co-founder of fast.ai, making deep learning accessible",
      href: "https://x.com/jeremyphoward",
      src: (
        <img src="https://unavatar.io/x/jeremyphoward" alt="Jeremy Howard" className="size-full" />
      ),
    },
    {
      title: "Yen-Ling Kuo",
      description: "AI researcher pushing boundaries",
      href: "https://x.com/yenling_kuo",
      src: (
        <img src="https://unavatar.io/x/yenling_kuo" alt="Yen-Ling Kuo" className="size-full" />
      ),
    },
    {
      title: "Lance Martin",
      description: "Building with LLMs and LangChain",
      href: "https://x.com/RLanceMartin",
      src: (
        <img src="https://unavatar.io/x/RLanceMartin" alt="Lance Martin" className="size-full" />
      ),
    },
    {
      title: "Claude AI",
      description: "AI assistant by Anthropic",
      href: "https://x.com/claudeai",
      src: (
        <img src="https://unavatar.io/x/claudeai" alt="Claude AI" className="size-full" />
      ),
    },
    {
      title: "Naval",
      description: "Entrepreneur, philosopher and investor I look up to",
      href: "https://nav.al",
      src: (
        <img src="/inspiration/naval.jpg" alt="Naval" className="size-full" />
      ),
    },
  ];
  return (
    <div className="no-plus-cursor">
      <Container className="min-h-screen">
        <p className="text-foreground pt-4 text-base">
          A list of all the people that I look up to, websites that I admire,
          tools that I use and everything else that follows.
        </p>
        <p className="text-foreground pt-4 text-base">
          I will keep on updating this list as I find more inspiration.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          {items.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              className="group flex items-center gap-2"
            >
              <div className="mr-2 flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-linear-to-b from-neutral-50 to-neutral-100 shadow-sm ring-1 shadow-black/10 ring-black/10 md:size-8">
                {item.src}
              </div>
              <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                <p className="text-foreground font-medium">{item.title}</p>
                <div className="hidden size-1 rounded-full bg-neutral-200 md:block"></div>
                <p className="text-foreground/70 group-hover:text-primary text-balance transition-transform duration-300 group-hover:translate-x-1">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
      <Container>
        <DottedSeparator className="my-8" />
      </Container>
    </div>
  );
}
