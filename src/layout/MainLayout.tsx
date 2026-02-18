import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.jpg';

const MainLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
    const { favorites } = useFavorites();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const menuVariants = {
        closed: {
            opacity: 0,
            x: '100%',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        }
    } as const;

    const overlayVariants = {
        closed: { opacity: 0, pointerEvents: 'none' as const },
        open: { opacity: 1, pointerEvents: 'auto' as const }
    } as const;

    const navLinks = [
        { to: '/', label: t.nav.home },
        { to: '/movies', label: t.nav.movies },
        { to: '/quiz', label: t.nav.quiz, special: true },
        { to: '/search', label: t.nav.search },
        { to: '/favorites', label: t.nav.favorites, counter: favorites.length }
    ];

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

                    <div className="flex items-center gap-2">
                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium mr-4">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative hover:text-red-600 transition flex items-center gap-1.5 ${link.special ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 hover:scale-105' : ''}`}
                                >
                                    {link.label}
                                    {link.counter !== undefined && link.counter > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="flex items-center justify-center bg-red-600 text-white text-[10px] w-4 h-4 rounded-full font-bold"
                                        >
                                            {link.counter}
                                        </motion.span>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Theme/Lang (Desktop only) */}
                        <div className="hidden md:flex items-center gap-2 border-l border-gray-300 dark:border-gray-700 pl-4">
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

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors z-[60]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={overlayVariants}
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden"
                            />
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={menuVariants}
                                className="fixed top-0 right-0 h-screen w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-[55] md:hidden pt-20 px-6 overflow-y-auto"
                            >
                                <div className="flex flex-col gap-1 mb-8">
                                    <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 dark:text-gray-600 mb-4">{t.nav.home} Menu</h2>
                                    {navLinks.map((link, idx) => (
                                        <motion.div
                                            key={link.to}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                        >
                                            <Link
                                                to={link.to}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center justify-between p-4 rounded-xl text-lg font-bold transition-all ${link.special ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                            >
                                                <span>{link.label}</span>
                                                {link.counter !== undefined && link.counter > 0 && (
                                                    <span className="bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                                                        {link.counter}
                                                    </span>
                                                )}
                                                {!link.special && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 dark:border-white/10 pt-8 mt-auto mb-8">
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 dark:text-gray-600 mb-4">Ajustes</h3>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-white/5 rounded-xl">
                                            <span className="font-bold text-gray-600 dark:text-gray-400">Idioma</span>
                                            <button
                                                onClick={toggleLanguage}
                                                className="bg-red-600 text-white px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-wider shadow-lg"
                                            >
                                                {language}
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-white/5 rounded-xl">
                                            <span className="font-bold text-gray-600 dark:text-gray-400">Modo</span>
                                            <button
                                                onClick={toggleTheme}
                                                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300"
                                            >
                                                {theme === 'dark' ? (
                                                    <div className="flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                        <span className="text-xs font-bold uppercase">Claro</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                        </svg>
                                                        <span className="text-xs font-bold uppercase">Oscuro</span>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pb-8 text-center">
                                    <p className="text-[10px] text-gray-500 dark:text-gray-600 font-bold uppercase tracking-widest leading-loose">
                                        MJI Films <br />
                                        Ismael | Jose Luis | Mario
                                    </p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>

            <main className="flex-grow pt-16 overflow-x-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
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
