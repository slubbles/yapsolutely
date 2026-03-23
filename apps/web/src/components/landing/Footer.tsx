import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-14 px-6 border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <span className="font-display text-sm font-medium text-foreground block mb-3">Yapsolutely</span>
            <p className="font-body text-[0.75rem] text-text-subtle/60 leading-[1.6] max-w-[200px]">
              AI voice agents that answer your phone. Build, deploy, monitor.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="font-body text-[0.65rem] text-text-subtle/40 uppercase tracking-[0.12em] mb-3">Product</div>
            <div className="flex flex-col gap-2">
              <a href="#product" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">Features</a>
              <Link href="/pricing" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/changelog" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">Changelog</Link>
              <Link href="/docs" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">Documentation</Link>
              <Link href="/docs/api" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">API Reference</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="font-body text-[0.65rem] text-text-subtle/40 uppercase tracking-[0.12em] mb-3">Company</div>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">About</Link>
              <Link href="/support" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">Support</Link>
              <Link href="/compliance" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">Compliance</Link>
              <a href="mailto:hello@yapsolutely.com" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <div className="font-body text-[0.65rem] text-text-subtle/40 uppercase tracking-[0.12em] mb-3">Legal</div>
            <div className="flex flex-col gap-2">
              <Link href="/terms" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="font-body text-[0.78rem] text-text-subtle hover:text-foreground transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/30 flex items-center justify-center">
          <span className="font-body text-xs text-text-subtle/50">© {new Date().getFullYear()} Yapsolutely, Inc.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
