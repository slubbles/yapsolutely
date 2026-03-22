import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="pt-24 pb-20">{children}</main>
      <Footer />
    </div>
  );
}
