import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="text-center max-w-md">
        <div className="font-mono text-[4rem] font-bold text-text-subtle/20 mb-4">404</div>
        <h1 className="font-display text-[1.3rem] font-semibold tracking-[-0.02em] text-text-strong mb-2">
          Page not found
        </h1>
        <p className="font-body text-[0.85rem] text-text-subtle mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-foreground text-primary-foreground font-body text-[0.8rem] font-medium hover:opacity-90 transition-opacity"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-border-soft bg-surface-panel font-body text-[0.8rem] text-text-body hover:bg-surface-subtle transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
