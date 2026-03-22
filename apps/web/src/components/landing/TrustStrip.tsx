const TrustStrip = () => {
  const capabilities = [
    { label: "Sub-second voice latency", detail: "< 800ms" },
    { label: "Full transcript review", detail: "100%" },
    { label: "Dedicated phone numbers", detail: "Real lines" },
    { label: "Always-on availability", detail: "24/7" },
    { label: "Zero integration work", detail: "Instant" },
  ];

  return (
    <section className="py-6 sm:py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4 sm:gap-x-8">
          {capabilities.map((cap, i) => (
            <div key={cap.label} className="flex items-center gap-3">
              {i > 0 && <span className="hidden sm:block w-px h-4 bg-border/40" />}
              <div className="flex items-center gap-2">
                <span className="font-display text-[0.7rem] font-medium text-text-body tracking-wide">{cap.detail}</span>
                <span className="font-body text-[0.7rem] text-text-subtle/60">{cap.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
