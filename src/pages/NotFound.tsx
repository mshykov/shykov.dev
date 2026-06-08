import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 md:py-32">
      <Seo
        title="Page not found — Maksym Shykov"
        description="The page you're looking for doesn't exist."
        path="/404"
        noindex
      />
      <p className="text-blue-600 dark:text-blue-400 font-bold tracking-wider mb-2">404</p>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Page not found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;
