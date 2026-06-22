import { Outlet, NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sun, Moon, Mail, Copy, Check } from 'lucide-react';
import { initAnalytics } from '../firebase';
import { getConsent, setConsent } from '../lib/consent';
import SocialLinks from './SocialLinks';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'text-ink dark:text-ink-dark underline decoration-1 underline-offset-8 transition-colors'
    : 'hover:text-ink dark:hover:text-ink-dark transition-colors';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/experience', label: 'Experience' },
  { to: '/blog', label: 'Writing' },
];

const Layout = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [showCookies, setShowCookies] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      // `navigator.clipboard` is undefined in insecure contexts and writeText
      // rejects when the document lacks focus/permission — only flip the
      // success state once the write actually resolves.
      await navigator.clipboard?.writeText('maksym@shykov.dev');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // copy failed — leave the UI unchanged (the mailto link is the fallback)
    }
  };

  useEffect(() => {
    // Sync initial preference to document element (don't call setState here)
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // no-op: localStorage may be unavailable in some environments
    }

    // Show the banner only until the visitor has made a choice. If they
    // previously accepted, (re)initialize analytics for this session.
    const consent = getConsent();
    let timer: number | undefined;
    if (consent === null) {
      timer = window.setTimeout(() => setShowCookies(true), 1500); // Small delay for better UX
    } else if (consent === 'accepted') {
      void initAnalytics();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const acceptCookies = () => {
    setConsent('accepted');
    void initAnalytics();
    setShowCookies(false);
  };

  const declineCookies = () => {
    setConsent('declined');
    setShowCookies(false);
  };

  return (
    <div className="layout-root">
      {/* Header */}
      <header className="layout-header">
        <div className="layout-header-inner">
          {/* Brand is intentionally not an <h1>: each page owns its own <h1>
              so the heading reflects the current route for AT/SEO. */}
          <Link
            to="/"
            className="text-sm font-semibold tracking-tight text-ink dark:text-ink-dark whitespace-nowrap"
          >
            {/* No aria-label: the accessible name comes from the visible text at
                each breakpoint ("Maksym Shykov" / "MS"), so it always matches the
                visible label (WCAG 2.5.3 Label in Name). */}
            <span className="hidden sm:inline">Maksym Shykov</span>
            <span className="sm:hidden">MS</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav>
              <ul className="layout-nav-list">
                {navItems.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink to={to} className={navLinkClass}>
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer id="contact" className="layout-footer">
        <div className="layout-footer-inner">
          <div>
            <h2 className="text-base font-semibold text-ink dark:text-ink-dark mb-2">
              Get in touch
            </h2>
            <p className="text-sm text-ink-secondary dark:text-ink-secondary-dark max-w-sm mb-4 leading-relaxed">
              Open to conversations about engineering leadership, AI products,
              and building teams.
            </p>
            <div className="flex items-center gap-3">
              <a href="mailto:maksym@shykov.dev" className="btn-ink">
                <Mail className="w-4 h-4" />
                Email me
              </a>
              <button
                onClick={copyEmail}
                className="btn-ghost px-3"
                aria-label="Copy email address"
                title="Copy email address"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="social-links">
            <SocialLinks />
          </div>
        </div>

        <div className="mt-10 text-xs text-ink-tertiary dark:text-ink-tertiary-dark">
          <p>© {new Date().getFullYear()} Maksym Shykov</p>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookies && (
        <div className="cookie-banner-enter fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-sm bg-paper dark:bg-surface-dark p-5 rounded-lg shadow-lg border border-hairline dark:border-hairline-dark z-50">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-ink dark:text-ink-dark">Cookies</h2>
              <p className="text-xs text-ink-secondary dark:text-ink-secondary-dark leading-relaxed">
                This site uses cookies to analyze traffic via Google Analytics.
                By clicking "Accept", you agree to the use of cookies.
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={acceptCookies} className="btn-ink flex-1 justify-center">
                Accept
              </button>
              <button onClick={declineCookies} className="btn-ghost flex-1">
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
