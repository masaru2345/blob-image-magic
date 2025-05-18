
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-6 border-t border-muted">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="font-heading text-xl font-bold gradient-text hover:opacity-90 transition-opacity">
            InstantImg
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          Built and managed by{" "}
          <a
            href="https://flux8labs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75 focus-visible:rounded"
          >
            flux8labs.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
