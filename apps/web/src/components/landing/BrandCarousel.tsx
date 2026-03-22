"use client";

const brands = [
  { name: "Zendesk", tagline: "Customer support" },
  { name: "Zocdoc", tagline: "Healthcare scheduling" },
  { name: "Opendoor", tagline: "Real estate" },
  { name: "Calendly", tagline: "Appointment booking" },
  { name: "HubSpot", tagline: "CRM & sales" },
  { name: "ServiceTitan", tagline: "Home services" },
  { name: "Lemonade", tagline: "Insurance" },
  { name: "Better.com", tagline: "Mortgage lending" },
  { name: "Dialpad", tagline: "Business comms" },
  { name: "Freshworks", tagline: "IT & support" },
  { name: "Toast", tagline: "Restaurants" },
  { name: "Mindbody", tagline: "Wellness booking" },
];

const BrandCarousel = () => {
  /* Duplicate the list so the seamless loop always has content visible */
  const items = [...brands, ...brands];

  return (
    <section className="py-10 sm:py-14 overflow-hidden select-none">
      <p className="text-center font-body text-[0.7rem] text-text-subtle/50 uppercase tracking-[0.18em] mb-6">
        Built for teams like
      </p>

      <div className="relative">
        {/* Left / right fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 z-10 bg-gradient-to-r from-canvas to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 z-10 bg-gradient-to-l from-canvas to-transparent" />

        <div className="flex gap-8 sm:gap-12 animate-scroll-left">
          {items.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center gap-3 shrink-0"
            >
              {/* Logo placeholder — first letter in a muted circle */}
              <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border-soft/30 flex items-center justify-center">
                <span className="font-display text-[0.75rem] font-semibold text-text-subtle/60">
                  {brand.name[0]}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[0.85rem] font-medium text-text-body/80 whitespace-nowrap">
                  {brand.name}
                </span>
                <span className="font-body text-[0.6rem] text-text-subtle/40 whitespace-nowrap">
                  {brand.tagline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
