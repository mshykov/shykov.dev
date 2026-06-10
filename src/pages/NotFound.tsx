import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const NotFound = () => {
  return (
    <div className="flex flex-col items-start py-24 md:py-32">
      <Seo
        title="Page not found — Maksym Shykov"
        description="The page you're looking for doesn't exist."
        path="/404"
        noindex
      />
      <p className="section-label mb-4">404</p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink dark:text-ink-dark mb-4">
        Page not found
      </h1>
      <p className="text-ink-secondary dark:text-ink-secondary-dark max-w-md mb-8 leading-relaxed">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn-ink">
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;
