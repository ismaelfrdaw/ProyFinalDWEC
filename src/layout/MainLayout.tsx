import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.jpg';

const MainLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 dark-mode-override text-gray-900 dark:text-white font-sans transition-colors duration-300">
            <header className="bg-white/80 dark:bg-black/50 backdrop-blur-md fixed w-full z-50 top-0 border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="group flex items-center transition">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 dark:border-white/20 shadow-sm group-hover:scale-110 transition-transform">
                                <img src={logo} alt="MJI Films" className="h-full w-full object-cover" />
                            </div>
                        </Link>
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold hidden sm:block">
                            by Ismael | Jose Luis | Mario
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex gap-6 text-sm font-medium">
                            <Link to="/" className="hover:text-red-600 transition">{t.nav.home}</Link>
                            <Link to="/movies" className="hover:text-red-600 transition">{t.nav.movies}</Link>
                            <Link to="/quiz" className="hover:text-amber-500 transition font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">{t.nav.quiz}</Link>
                            <Link to="/search" className="hover:text-red-600 transition">{t.nav.search}</Link>
                        </nav>

                        <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-700 pl-4 ml-2">
                            <button
                                onClick={toggleLanguage}
                                className="font-bold text-sm tracking-wide hover:text-red-500 transition-colors bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded"
                            >
                                {language.toUpperCase()}
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow pt-16">
                <Outlet />
            </main>

            <footer className="bg-black py-8 border-t border-white/5 mt-auto transition-colors duration-300">
                <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-200 dark:border-white/10 shadow-lg brightness-90">
                            <img src={logo} alt="MJI Films" className="h-full w-full object-cover" />
                        </div>
                    </div>
                    <p>&copy; {new Date().getFullYear()} {t.footer.rights}</p>
                    <p className="mt-2 text-xs">{t.footer.data}</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
