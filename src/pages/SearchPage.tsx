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
                try {
                    const data = await getTrending('week');
                    setTrending(data);
                } catch (error) {
                    console.error("Error fetching trending in SearchPage:", error);
                }
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
        <div className="min-h-screen bg-gray-900 transition-colors duration-500">
            {/* Search Hero */}
            <div className="bg-gradient-to-b from-black to-gray-900 py-16 md:py-24 border-b border-white/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
                            {query ? (
                                <>
                                    {t.search.results_for} <span className="text-red-600">"{query}"</span>
                                </>
                            ) : (
                                t.nav.search
                            )}
                        </h1>
                        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                            {query ? `Hemos encontrado ${results.length} coincidencias para tu búsqueda.` : "Busca entre millones de películas, series y actores por todo el mundo."}
                        </p>
                        <div className="flex justify-center transform hover:scale-[1.02] transition-transform">
                            <SearchBar />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader />
                        <p className="text-gray-500 animate-pulse">Buscando en la base de datos...</p>
                    </div>
                ) : query ? (
                    results.length > 0 ? (
                        <div className="animate-in fade-in duration-700">
                            <MovieGrid items={results} />
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-2xl text-gray-400 font-medium">{t.search.no_results}</p>
                            <button
                                onClick={() => window.location.href = '/search'}
                                className="mt-6 text-red-500 hover:text-red-400 font-bold transition-colors"
                            >
                                Limpiar búsqueda
                            </button>
                        </div>
                    )
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-1.5 h-10 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                    {t.home.trending}
                                </h2>
                                <p className="text-gray-500 text-sm">Lo más visto esta semana en MJI Films</p>
                            </div>
                        </div>
                        <MovieGrid items={trending} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
