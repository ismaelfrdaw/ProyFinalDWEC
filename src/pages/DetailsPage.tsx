import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
    getMovieDetails,
    getTVDetails,
    getMovieCredits,
    getTVCredits,
    getSimilarMovies,
    getSimilarTV,
    imageUrl
} from '../services/api';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import Loader from '../components/atoms/Loader';
import MovieGrid from '../components/organisms/MovieGrid';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';

const DetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const isMovie = location.pathname.includes('/movie/');
    const [item, setItem] = useState<any>(null);
    const [cast, setCast] = useState<any[]>([]);
    const [similar, setSimilar] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const favorite = isFavorite(Number(id));

    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const idNum = Number(id);
                const [detailsData, creditsData, similarData] = await Promise.all([
                    isMovie ? getMovieDetails(idNum) : getTVDetails(idNum),
                    isMovie ? getMovieCredits(idNum) : getTVCredits(idNum),
                    isMovie ? getSimilarMovies(idNum) : getSimilarTV(idNum)
                ]);

                setItem(detailsData);
                setCast(creditsData.cast?.slice(0, 10) || []);
                setSimilar(similarData?.slice(0, 5) || []);
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
        window.scrollTo(0, 0);
    }, [id, isMovie]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (!item) return <div className="text-center text-gray-900 dark:text-white py-20">{t.details.no_content}</div>;

    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? new Date(date).getFullYear() : 'N/A';

    const handleFavoriteToggle = () => {
        if (favorite) {
            removeFavorite(item.id);
        } else {
            addFavorite({
                id: item.id,
                title,
                poster_path: item.poster_path,
                vote_average: item.vote_average,
                media_type: isMovie ? 'movie' : 'tv',
                release_date: date
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
        >
            {/* Backdrop */}
            <div className="relative h-[20vh] md:h-[30vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110 hover:scale-100"
                    style={{ backgroundImage: `url(${imageUrl(item.backdrop_path, 'original')})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10 -mt-16 md:-mt-24 pb-20">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* Poster */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-80 lg:w-96"
                    >
                        <div className="relative group">
                            <img
                                src={imageUrl(item.poster_path, 'w500')}
                                alt={title}
                                className="rounded-2xl shadow-2xl border border-white/10 w-full"
                            />
                            <button
                                onClick={handleFavoriteToggle}
                                className={`absolute top-4 right-4 p-4 rounded-full backdrop-blur-md border border-white/20 transition-all ${favorite ? 'bg-red-600 text-white' : 'bg-black/40 text-white hover:bg-white/20'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${favorite ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-grow text-white">
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 uppercase tracking-tighter leading-none">
                                {title}
                                <span className="text-gray-500 font-light block md:inline md:ml-4">{year}</span>
                            </h1>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <Badge variant="primary">{isMovie ? t.details.movie : t.details.tv}</Badge>
                                {item.genres?.map((g: any) => (
                                    <Badge key={g.id} variant="outline">{g.name}</Badge>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-full border-4 font-black text-lg bg-black/40 ${item.vote_average >= 7 ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
                                        {item.vote_average.toFixed(1)}
                                    </div>
                                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">{t.details.score}</div>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowTrailer(true)}
                                    disabled={!item.video_key}
                                    className="px-6 py-3 rounded-full shadow-lg shadow-red-900/30 font-black uppercase tracking-widest text-xs"
                                >
                                    {item.video_key ? t.details.play_trailer : t.details.trailer_unavailable}
                                </Button>
                            </div>

                            <div className="mb-8 max-w-3xl">
                                <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-2">{t.details.overview}</h3>
                                <p className="text-gray-300 leading-relaxed text-lg font-medium">
                                    {item.overview || t.details.no_overview}
                                </p>
                            </div>

                            {item.tagline && (
                                <div className="mb-12 text-2xl font-light text-gray-400 italic font-serif">
                                    "{item.tagline}"
                                </div>
                            )}
                        </motion.div>

                        {/* Cast Section */}
                        {cast.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="mb-12"
                            >
                                <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.3em] mb-6">{t.details.cast}</h3>
                                <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
                                    {cast.map((actor: any) => (
                                        <div key={actor.id} className="flex-shrink-0 w-24 md:w-32 text-center group">
                                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-red-600 transition-all duration-300 shadow-xl">
                                                <img
                                                    src={actor.profile_path ? imageUrl(actor.profile_path, 'w185') : 'https://placehold.co/185x185?text=Actor'}
                                                    alt={actor.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <p className="text-sm font-bold truncate text-white">{actor.name}</p>
                                            <p className="text-[10px] text-gray-500 font-medium truncate uppercase">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Similar Content */}
                {similar.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-20"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{t.details.similar}</h3>
                        </div>
                        <MovieGrid items={similar} />
                    </motion.div>
                )}
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {showTrailer && item.video_key && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
                        onClick={() => setShowTrailer(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.3)] border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowTrailer(false)}
                                className="absolute top-6 right-6 text-white hover:text-red-500 z-10 bg-black/50 hover:bg-black rounded-full p-3 transition-all border border-white/10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${item.video_key}?autoplay=1`}
                                title="Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DetailsPage;
