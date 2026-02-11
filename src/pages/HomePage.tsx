import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/molecules/SearchBar';
import MovieGrid from '../components/organisms/MovieGrid';
import Loader from '../components/atoms/Loader';
import { getTrending, getPopularTV, imageUrl } from '../services/api';
import type { Movie, TVShow } from '../types';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.jpg';

const HomePage = () => {
    const { t } = useLanguage();
    const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
    const [popularTV, setPopularTV] = useState<TVShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [heroImage, setHeroImage] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trendingData, tvData] = await Promise.all([
                    getTrending(),
                    getPopularTV()
                ]);

                setTrending(trendingData);
                setPopularTV(tvData);

                // Set hero image from the first trending item
                if (trendingData.length > 0) {
                    setHeroImage(imageUrl(trendingData[0].backdrop_path, 'original'));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

    return (
        <div>
            {/* Hero Section */}
            <section
                className="relative h-[60vh] flex items-center justify-center bg-cover bg-center transition-all duration-1000"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-red-600/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] hover:scale-105 transition-transform duration-500 mb-4 bg-black">
                            <img src={logo} alt="MJI Films" className="w-full h-full object-cover scale-110" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg opacity-90">
                            {t.home.welcome}
                        </h1>
                    </div>
                    <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
                        {t.home.subtitle}
                    </p>
                    <div className="flex justify-center">
                        <SearchBar />
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <div className="container mx-auto px-4 -mt-8 relative z-20 space-y-12 pb-12">

                {/* Quiz CTA */}
                <div className="bg-gradient-to-br from-gray-900 to-red-950 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M17.636 17.636l-.707-.707M12 21v-1M4.364 17.636l.707-.707M3 12h1m1.636-6.364l.707.707" />
                        </svg>
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.quiz.title}</h2>
                        <p className="text-gray-300 text-lg mb-8">
                            {t.quiz.subtitle}
                        </p>
                        <Link
                            to="/quiz"
                            className="inline-block bg-red-600 text-white font-bold py-4 px-8 rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 transform hover:-translate-y-1"
                        >
                            {t.quiz.cta}
                        </Link>
                    </div>
                </div>

                <MovieGrid title={t.home.trending} items={trending.slice(0, 10)} />

                <MovieGrid title={t.home.popular_tv} items={popularTV.slice(0, 10)} />
            </div>
        </div>
    );
};

export default HomePage;
