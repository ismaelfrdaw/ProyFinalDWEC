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
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const data = await discoverMovies(selectedGenre, sortBy);
                setMovies(data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [selectedGenre, sortBy]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-l-4 border-red-600 pl-4">{t.movies.title}</h1>

            {/* Filters */}
            <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">{t.movies.filter_genre}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedGenre(undefined)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!selectedGenre ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        {t.movies.all_genres}
                    </button>
                    {genres.map(genre => (
                        <button
                            key={genre.id}
                            onClick={() => setSelectedGenre(genre.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedGenre === genre.id ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">{t.movies.sort_by}</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm rounded-md px-3 py-2 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-red-500"
                    >
                        <option value="popularity.desc">{t.movies.sort_options.popularity}</option>
                        <option value="vote_average.desc">{t.movies.sort_options.rating}</option>
                        <option value="primary_release_date.desc">{t.movies.sort_options.newest}</option>
                        <option value="revenue.desc">{t.movies.sort_options.revenue}</option>
                    </select>
                </div>
            </div>

            {loading ? <Loader /> : <MovieGrid items={movies} />}
        </div>
    );
};

export default MoviesPage;
