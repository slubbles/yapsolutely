export function LandingFooter() {
  return (
    <footer className="border-t border-black/5 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="font-display text-sm font-medium text-[var(--text-strong)]">Yapsolutely</span>
        <div className="flex items-center gap-6 text-[0.8rem] text-[var(--text-subtle)]">
          <a href="#" className="transition-colors hover:text-[var(--text-strong)]">Privacy</a>
          <a href="#" className="transition-colors hover:text-[var(--text-strong)]">Terms</a>
          <a href="#" className="transition-colors hover:text-[var(--text-strong)]">Status</a>
          <a href="#" className="transition-colors hover:text-[var(--text-strong)]">Contact</a>
        </div>
        <span className="text-xs text-[color:rgba(124,129,139,0.6)]">© 2026 Yapsolutely, Inc.</span>
      </div>
    </footer>
  );
}