"use client";

import Image from "next/image";

const stack = [
  { name: "Twilio", file: "twilio.svg" },
  { name: "Deepgram", file: "deepgram.svg" },
  { name: "Anthropic", file: "anthropic.svg" },
  { name: "Next.js", file: "nextdotjs.svg" },
  { name: "PostgreSQL", file: "postgresql.svg" },
  { name: "Prisma", file: "prisma.svg" },
];

const BrandCarousel = () => {
  return (
    <section className="py-10 sm:py-14 overflow-hidden select-none">
      <p className="text-center font-body text-[0.7rem] text-text-subtle/50 uppercase tracking-[0.18em] mb-6">
        Powered by
      </p>

      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 px-6">
        {stack.map((brand) => (
          <div key={brand.name} className="flex items-center gap-2.5 opacity-40 hover:opacity-60 transition-opacity grayscale">
            <Image
              src={`/logos/${brand.file}`}
              alt={brand.name}
              width={24}
              height={24}
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
            <span className="font-display text-[0.85rem] sm:text-[0.95rem] font-semibold text-foreground whitespace-nowrap">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandCarousel;
