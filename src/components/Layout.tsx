import { Outlet, NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sun, Moon, Github, Linkedin, Mail, Twitter, Copy, Check } from 'lucide-react';
import { initAnalytics } from '../firebase';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Stored in localStorage under 'cookie-consent' as 'accepted' | 'declined';
// null means the visitor hasn't chosen yet (banner should show).
const CONSENT_KEY = 'cookie-consent';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'text-blue-600 dark:text-blue-400 underline decoration-3 underline-offset-8 transition-colors'
    : 'hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:underline decoration-3 underline-offset-8';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/experience', label: 'Experience' },
  { to: '/blog', label: 'Blog' },
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
      await navigator.clipboard?.writeText('maksym.shykov@gmail.com');
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
    const consent = localStorage.getItem(CONSENT_KEY);
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
    localStorage.setItem(CONSENT_KEY, 'accepted');
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    void initAnalytics();
    setShowCookies(false);
  };

  const declineCookies = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    setShowCookies(false);
  };

  return (
    <div className="layout-root">
      {/* Header */}
      <header className="layout-header">
        <div className="layout-header-inner w-full">
          <Link to="/" className="site-brand -m-2 p-2 rounded-xl transition-colors">
            {/* Brand is intentionally not an <h1>: each page owns its own <h1>
                so the heading reflects the current route for AT/SEO. */}
            <span className="block text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">
              Maksym Shykov
            </span>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              Engineering Lead & Tech Enthusiast
            </p>
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="layout-nav">
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
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
          <div className="footer-brand">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Get in Touch</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-6">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a 
                href="mailto:maksym.shykov@gmail.com" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
              >
                <Mail className="w-5 h-5" />
                Send an Email
              </a>
              <button
                onClick={copyEmail}
                className="theme-toggle flex items-center justify-center w-[52px] h-[52px] transition-colors"
                aria-label="Copy email address"
                title="Copy email address"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Follow Me</h3>
            <div className="social-links -m-2">
              <a href="https://github.com/mshykov" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/maksym-shykov/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://x.com/Shykov" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-400 dark:text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Maksym Shykov. All rights reserved.</p>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookies && (
        <div className="cookie-banner-enter fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-gray-900 dark:text-white">Cookie Policy</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                I use cookies to improve your experience and analyze traffic via Google Analytics. By clicking "Accept", you agree to the use of cookies.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={acceptCookies}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm"
              >
                Accept
              </button>
              <button
                onClick={declineCookies}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-bold py-2 px-4 rounded-xl transition-colors text-sm"
              >
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
