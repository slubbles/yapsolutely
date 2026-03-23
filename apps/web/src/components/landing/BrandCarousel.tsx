"use client";

import Image from "next/image";

const brands = [
  { name: "HubSpot", file: "hubspot.svg" },
  { name: "Zendesk", file: "zendesk.svg" },
  { name: "Calendly", file: "calendly.svg" },
  { name: "Stripe", file: "stripe.svg" },
  { name: "Shopify", file: "shopify.svg" },
  { name: "Intercom", file: "intercom.svg" },
  { name: "Notion", file: "notion.svg" },
  { name: "Asana", file: "asana.svg" },
  { name: "Linear", file: "linear.svg" },
  { name: "Figma", file: "figma.svg" },
  { name: "Airtable", file: "airtable.svg" },
  { name: "Dropbox", file: "dropbox.svg" },
];

const BrandCarousel = () => {
  return (
    <section className="py-10 sm:py-14 overflow-hidden select-none">
      <p className="text-center font-body text-[0.7rem] text-text-subtle/50 uppercase tracking-[0.18em] mb-6">
        Built for teams like
      </p>

      <div className="relative">
        {/* Left / right fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 z-10 bg-gradient-to-r from-canvas to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 z-10 bg-gradient-to-l from-canvas to-transparent" />

        {/* Two identical tracks side by side for seamless infinite loop */}
        <div className="flex w-max animate-scroll-left">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-10 sm:gap-14 px-5 sm:px-7 shrink-0">
              {brands.map((brand) => (
                <div key={`${brand.name}-${copy}`} className="shrink-0 flex items-center gap-2.5 opacity-40 hover:opacity-60 transition-opacity grayscale">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
