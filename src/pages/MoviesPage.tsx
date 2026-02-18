import { useEffect, useState } from 'react';
import MovieGrid from '../components/organisms/MovieGrid';
import Loader from '../components/atoms/Loader';
import { discoverMovies, getGenres } from '../services/api';
import type { Movie } from '../types';
import { useLanguage } from '../context/LanguageContext';

const MoviesPage = () => {
    const { t } = useLanguage();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string>('popularity.desc');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genreList = await getGenres();
                setGenres(genreList);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        // Reset page when filters change
        setMovies([]);
        setPage(1);
        setHasMore(true);
    }, [selectedGenre, sortBy]);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const data = await discoverMovies(selectedGenre, sortBy, page);
                if (data.length === 0) {
                    setHasMore(false);
                } else {
                    setMovies(prev => page === 1 ? data : [...prev, ...data]);
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [selectedGenre, sortBy, page]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-l-4 border-red-600 pl-4">
                {t.movies.title}
            </h1>

            {/* Filters */}
            <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">{t.movies.filter_genre}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedGenre(undefined)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!selectedGenre ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        {t.movies.all_genres}
                    </button>
                    {genres.length > 0 && genres.map(genre => (
                        <button
                            key={genre.id}
                            onClick={() => setSelectedGenre(genre.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedGenre === genre.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t.movies.sort_by}</label>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm rounded-md pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 appearance-none transition-all"
                        >
                            <option value="popularity.desc">{t.movies.sort_options.popularity}</option>
                            <option value="vote_average.desc">{t.movies.sort_options.rating}</option>
                            <option value="primary_release_date.desc">{t.movies.sort_options.newest}</option>
                            <option value="revenue.desc">{t.movies.sort_options.revenue}</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <MovieGrid items={movies} />

            {loading && <div className="mt-8 flex justify-center"><Loader /></div>}

            {!loading && hasMore && movies.length > 0 && (
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 border border-white/10"
                    >
                        {t.movies.load_more}
                    </button>
                </div>
            )}
        </div>
    );
};

export default MoviesPage;
