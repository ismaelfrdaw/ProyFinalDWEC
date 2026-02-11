import { Link } from 'react-router-dom';
import { imageUrl } from '../../services/api';
import Badge from '../atoms/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MovieCardProps {
    id: number;
    title: string;
    posterPath: string;
    rating: number;
    type: 'movie' | 'tv';
    year?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ id, title, posterPath, rating, type, year }) => {
    const { t } = useLanguage();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const favorite = isFavorite(id);

    const linkPath = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;

    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (favorite) {
            removeFavorite(id);
        } else {
            addFavorite({
                id,
                title,
                poster_path: posterPath,
                vote_average: rating,
                media_type: type,
                release_date: year
            });
        }
    };

    const getRatingColor = (score: number) => {
        if (score >= 7) return 'text-green-400 border-green-400';
        if (score >= 5) return 'text-yellow-400 border-yellow-400';
        return 'text-red-400 border-red-400';
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="h-full"
        >
            <Link to={linkPath} className="group relative block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-red-900/20 border border-gray-100 dark:border-gray-700 h-full flex flex-col transition-colors duration-300">
                <div className="aspect-[2/3] w-full overflow-hidden bg-gray-200 dark:bg-gray-900 relative">
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={imageUrl(posterPath, 'w500')}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/500x750?text=${encodeURIComponent(title)}`;
                        }}
                    />

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                            {t.search.button}
                        </span>
                    </div>

                    {/* Quality/Type Badge */}
                    <div className="absolute top-3 left-3">
                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-white/10">
                            {type === 'movie' ? '4K' : 'HD'}
                        </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={handleFavoriteToggle}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-red-600 transition-colors group/fav"
                    >
                        <AnimatePresence mode="wait">
                            {favorite ? (
                                <motion.svg
                                    key="heart-filled"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white fill-current" viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.172a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    key="heart-outline"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </button>

                    <div className="absolute bottom-3 right-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold border-2 ${getRatingColor(rating)} shadow-lg`}>
                            {rating.toFixed(1)}
                        </span>
                    </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[2.5em] group-hover:text-red-600 transition-colors mb-2">
                        {title}
                    </h3>
                    <div className="mt-auto flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        <span>{year ? year.split('-')[0] : 'N/A'}</span>
                        <div className="flex gap-1">
                            <Badge variant="outline">
                                {type === 'movie' ? t.details.movie : t.details.tv}
                            </Badge>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default MovieCard;
