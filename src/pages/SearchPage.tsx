import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from '../components/organisms/MovieGrid';
import Loader from '../components/atoms/Loader';
import { searchMulti } from '../services/api';
import type { Movie, TVShow } from '../types';
import { useLanguage } from '../context/LanguageContext';

const SearchPage = () => {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<(Movie | TVShow)[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const data = await searchMulti(query);
                setResults(data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);

    }, [query]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t.search.results_for} <span className="text-red-500">{query ? `"${query}"` : '...'}</span>
                </h1>
                <div className="w-full md:w-auto">
                    {/* Optional: Add a local search bar if user wants to refine search from here */}
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <MovieGrid items={results} />
            )}
        </div>
    );
};

export default SearchPage;
