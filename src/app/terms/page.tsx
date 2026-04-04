import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { readFileSync } from "fs";
import { join } from "path";

export default function TermsPage() {
  let html = "";
  try {
    html = readFileSync(
      join(process.cwd(), "public/terms-content.html"),
      "utf-8"
    );
  } catch {
    html = "<p>Terms of Service content could not be loaded.</p>";
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-3xl prose-custom"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      <Footer />
    </>
  );
}
