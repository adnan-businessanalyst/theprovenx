import { whoWeAre } from "@/content/whoWeAre";

export function WhoWeAreFooter() {
  const { left, right } = whoWeAre.footer;
  return (
    <footer className="wwa-footer">
      <div className="wwa-container wwa-footer-inner">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </footer>
  );
}
