import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from '../components/organisms/MovieGrid';
import Loader from '../components/atoms/Loader';
import SearchBar from '../components/molecules/SearchBar';
import { searchMulti, getTrending } from '../services/api';
import type { Movie, TVShow } from '../types';
import { useLanguage } from '../context/LanguageContext';

const SearchPage = () => {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<(Movie | TVShow)[]>([]);
    const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTrending = async () => {
            if (!query) {
                const data = await getTrending('week');
                setTrending(data);
            }
        };
        fetchTrending();
    }, [query]);

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
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg">
                    {query ? t.search.results_for : t.nav.search} {query && <span className="text-red-600 block md:inline">"{query}"</span>}
                </h1>
                <div className="flex justify-center scale-110 md:scale-125 mb-4">
                    <SearchBar />
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><Loader /></div>
            ) : query ? (
                results.length > 0 ? (
                    <MovieGrid items={results} />
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-2xl">{t.search.no_results}</p>
                    </div>
                )
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                        <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                            {t.home.trending}
                        </h2>
                    </div>
                    <MovieGrid items={trending} />
                </div>
            )}
        </div>
    );
};

export default SearchPage;
