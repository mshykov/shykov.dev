import { Outlet, NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sun, Moon, Github, Linkedin, Mail, Twitter, Copy, Check } from 'lucide-react';

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

  const copyEmail = () => {
    navigator.clipboard.writeText('maksym.shykov@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

    // Check if cookies accepted and show banner after a short delay
    const cookiesAccepted = localStorage.getItem('cookies-accepted');
    let timer: number | undefined;
    if (!cookiesAccepted) {
      timer = window.setTimeout(() => setShowCookies(true), 1500); // Small delay for better UX
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
    localStorage.setItem('cookies-accepted', 'true');
    setShowCookies(false);
  };

  return (
    <div className="layout-root">
      {/* Header */}
      <header className="layout-header">
        <div className="layout-header-inner w-full">
          <Link to="/" className="site-brand -m-2 p-2 rounded-xl transition-colors">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">
              Maksym Shykov
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              Engineering Lead & Tech Enthusiast
            </p>
          </Link>
          
          <div className="flex items-center space-x-4">
            <nav className="layout-nav">
              <ul className="layout-nav-list">
                <li>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? "text-blue-600 dark:text-blue-400 underline decoration-3 underline-offset-8 transition-colors" : "hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:underline decoration-3 underline-offset-8"}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/experience" 
                    className={({ isActive }) => isActive ? "text-blue-600 dark:text-blue-400 underline decoration-3 underline-offset-8 transition-colors" : "hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:underline decoration-3 underline-offset-8"}
                  >
                    Experience
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/blog" 
                    className={({ isActive }) => isActive ? "text-blue-600 dark:text-blue-400 underline decoration-3 underline-offset-8 transition-colors" : "hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:underline decoration-3 underline-offset-8"}
                  >
                    Blog
                  </NavLink>
                </li>
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
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
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
                onClick={() => setShowCookies(false)}
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
