import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6">
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">DECODE CO-A FORUM</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Where curiosity meets community.
          </p>
        </div>
        {/* Uncomment and edit if needed later */}
        {/* <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-4">
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
        </div> */}
      </div>
      <div className="container py-4 border-t text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} DECODE CO-A. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
  Created with <span className="inline-block animate-heartbeat" role="img" aria-label="heart">❤️</span> by DECODE CO-A Team
</p>
      </div>
    </footer>
  );
}

export default Footer;
