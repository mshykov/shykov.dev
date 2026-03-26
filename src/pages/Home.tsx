import { Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16 md:pb-24">
      <section className="home-hero pt-4 md:pt-12">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center transition-colors">
            {/* Replace with your actual photo later */}
            <span className="text-4xl text-gray-400 dark:text-gray-500 font-bold">MS</span>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white mb-1">
              Hi, I'm Maksym Shykov
            </h2>
            <p className="mt-2 text-lg text-slate-500 dark:text-slate-400 font-medium mb-6">
              Engineering Manager focused on building high-performance teams and delivering impactful products.
            </p>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6 mt-4">
              With 15 years of experience in IT, I specialize in leading cross-functional teams, implementing AI solutions, and fostering engineering excellence. When I'm not leading teams, you can find me exploring new technologies or writing about my learnings on my blog.
            </p>
            
            <div className="home-actions">
              <a href="https://github.com/mshykov" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors">
                <Github className="w-5 h-5" /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/maksym-shykov/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors">
                <Linkedin className="w-5 h-5" /> LinkedIn
              </a>
              <a href="https://x.com/Shykov" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors">
                <Twitter className="w-5 h-5" /> X (Twitter)
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-white dark:bg-[#111827] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/80">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">01</span>
            Core Skills
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full"></span> 
              <span className="font-medium">Engineering Leadership & Mentoring</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full"></span> 
              <span className="font-medium">Cross-Functional Team Building</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full"></span> 
              <span className="font-medium">AI Solutions (Search & Paywalls)</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full"></span> 
              <span className="font-medium">Quality Assurance & Test Automation</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full"></span> 
              <span className="font-medium">Agile Project Management</span>
            </li>
          </ul>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
            <Link to="/blog" className="group text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold inline-flex items-center gap-2 transition-colors hover:underline decoration-2 underline-offset-4">
              Read my latest articles <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
        
      <section>
        <div className="bg-white dark:bg-[#111827] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/80">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">02</span>
            What I Do
          </h3>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              I specialize in leading and scaling cross-functional engineering teams to deliver high-quality, impactful products. From architecting robust QA processes to driving cutting-edge AI integrations like smart search and personalized paywalls, my focus is on aligning engineering excellence with business value.
            </p>
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
              <Link to="/experience" className="group text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold inline-flex items-center gap-2 transition-colors hover:underline decoration-2 underline-offset-4">
                View my full experience <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
