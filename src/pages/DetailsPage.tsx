import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getMovieDetails, getTVDetails, imageUrl } from '../services/api';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import Loader from '../components/atoms/Loader';
import { useLanguage } from '../context/LanguageContext';

const DetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const isMovie = location.pathname.includes('/movie/');
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        // ... (existing useEffect) ...
        const fetchDetails = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = isMovie
                    ? await getMovieDetails(Number(id))
                    : await getTVDetails(Number(id));
                setItem(data);
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, isMovie]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (!item) return <div className="text-center text-gray-900 dark:text-white py-20">{t.details.no_content}</div>;

    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? new Date(date).getFullYear() : 'N/A';

    return (
        <div className="relative">
            {/* Backdrop */}
            <div
                className="absolute inset-0 h-[50vh] bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl(item.backdrop_path, 'original')})` }}
            >
                <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm transition-colors duration-300"></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10 pt-20">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                        <img
                            src={imageUrl(item.poster_path, 'w500')}
                            alt={title}
                            className="rounded-lg shadow-2xl w-64 md:w-80 border-4 border-gray-200 dark:border-gray-800"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-grow text-gray-900 dark:text-white transition-colors">
                        <h1 className="text-4xl font-bold mb-2">{title} <span className="text-gray-500 dark:text-gray-400 font-normal text-3xl">({year})</span></h1>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {item.genres?.map((g: any) => (
                                <Badge key={g.id} variant="outline">{g.name}</Badge>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2">
                                <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 font-bold text-lg ${item.vote_average >= 7 ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
                                    {item.vote_average.toFixed(1)}
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t.details.score}</span>
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => setShowTrailer(true)}
                                disabled={!item.video_key}
                            >
                                {item.video_key ? t.details.play_trailer : t.details.trailer_unavailable}
                            </Button>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">{t.details.overview}</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                {item.overview || t.details.no_overview}
                            </p>
                        </div>

                        {item.tagline && (
                            <div className="mb-8 italic text-gray-500">
                                "{item.tagline}"
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {showTrailer && item.video_key && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setShowTrailer(false)}>
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowTrailer(false); }}
                            className="absolute top-4 right-4 text-white hover:text-red-500 z-10 bg-black/50 rounded-full p-2 transition-colors"
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailsPage;
