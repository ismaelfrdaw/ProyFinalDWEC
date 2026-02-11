import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/molecules/SearchBar';
import MovieGrid from '../components/organisms/MovieGrid';
import Loader from '../components/atoms/Loader';
import { getTrending, getPopularTV, getUpcomingMovies, getTopRated, imageUrl } from '../services/api';
import type { Movie, TVShow } from '../types';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.jpg';
import { motion } from 'framer-motion';
import Button from '../components/atoms/Button';

const HomePage = () => {
    const { t } = useLanguage();
    const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
    const [popularTV, setPopularTV] = useState<TVShow[]>([]);
    const [upcoming, setUpcoming] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [heroImage, setHeroImage] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trendingData, tvData, upcomingData, topData] = await Promise.all([
                    getTrending(),
                    getPopularTV(),
                    getUpcomingMovies(),
                    getTopRated()
                ]);

                setTrending(trendingData);
                setPopularTV(tvData);
                setUpcoming(upcomingData);
                setTopRated(topData);

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-12 pb-20 overflow-x-hidden"
        >
            {/* Hero Section */}
            <motion.section
                variants={itemVariants}
                className="relative h-[60vh] flex items-center justify-center bg-cover bg-center transition-all duration-1000"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center mb-6"
                    >
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-red-600/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] hover:scale-105 transition-transform duration-500 mb-4 bg-black">
                            <img src={logo} alt="MJI Films" className="w-full h-full object-cover scale-110" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg opacity-90 uppercase tracking-tighter italic">
                            {t.home.welcome} <span className="text-red-600">MJI FILMS</span>
                        </h1>
                    </motion.div>
                    <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md font-medium">
                        {t.home.subtitle}
                    </p>
                    <div className="flex justify-center transform hover:scale-105 transition-transform">
                        <SearchBar />
                    </div>
                </div>
            </motion.section>

            {/* Content Section */}
            <div className="container mx-auto px-4 -mt-8 relative z-20 space-y-20 pb-12">

                {/* Quiz CTA */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="bg-gradient-to-br from-gray-900 to-red-950 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group border border-white/5"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M17.636 17.636l-.707-.707M12 21v-1M4.364 17.636l.707-.707M3 12h1m1.636-6.364l.707.707" />
                        </svg>
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">{t.quiz.title}</h2>
                        <p className="text-gray-300 text-lg mb-8 font-medium">
                            {t.quiz.subtitle}
                        </p>
                        <Link to="/quiz">
                            <Button variant="primary" className="px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-xl shadow-red-900/40">
                                {t.quiz.cta}
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <MovieGrid title={t.home.trending} items={trending.slice(0, 20)} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <MovieGrid title={t.home.popular_tv} items={popularTV.slice(0, 20)} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <MovieGrid title={t.home.upcoming} items={upcoming.slice(0, 20)} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <MovieGrid title={t.home.top_rated} items={topRated.slice(0, 20)} />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default HomePage;
    );
};

export default HomePage;
