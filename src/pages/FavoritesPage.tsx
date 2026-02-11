import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import MovieGrid from '../components/organisms/MovieGrid';
import { motion } from 'framer-motion';

const FavoritesPage = () => {
    const { favorites } = useFavorites();
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-12"
        >
            <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-10 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        {t.nav.favorites}
                    </h1>
                    <p className="text-gray-500 text-sm">Contenido guardado localmente en tu navegador</p>
                </div>
            </div>

            {favorites.length > 0 ? (
                <MovieGrid items={favorites} />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-800/20 rounded-3xl border border-dashed border-white/10">
                    <div className="w-20 h-20 mb-6 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <p className="text-xl text-gray-400 font-medium mb-2">{t.favorites.empty}</p>
                    <p className="text-gray-500 text-sm">Explora el catálogo y añade lo que quieras ver más tarde.</p>
                </div>
            )}
        </motion.div>
    );
};

export default FavoritesPage;
