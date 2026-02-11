import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMovies, mockTVShows } from '../services/mockData';
import MovieCard from '../components/molecules/MovieCard';
import Button from '../components/atoms/Button';
import type { Movie, TVShow } from '../types';
import { useLanguage } from '../context/LanguageContext';

// Logic structure (Genre weights) - separate from text
const questionLogic = [
    {
        id: 1,
        optionsWeights: [
            { 28: 3, 12: 2 }, // Action, Adventure
            { 35: 3 }, // Comedy
            { 18: 3, 10749: 2 }, // Drama, Romance
            { 9648: 3, 80: 2, 53: 2 } // Mystery, Crime, Thriller
        ]
    },
    {
        id: 2,
        optionsWeights: [
            { 18: 1, 80: 1, 53: 1, 27: 1 },
            { 10749: 3, 35: 1, 18: 1 },
            { 28: 2, 35: 2, 27: 2 },
            { 10751: 5, 16: 5 }
        ]
    },
    {
        id: 3,
        optionsWeights: [
            { 878: 5 },
            { 18: 1, 35: 1, 80: 1 },
            { 36: 5, 10752: 3 },
            { 14: 5, 12: 2 }
        ]
    },
    {
        id: 4,
        optionsWeights: [
            { 27: 5, 53: 3 },
            { 53: 3, 9648: 2 },
            { 35: 2, 10751: 2, 10749: 2 }
        ]
    },
    {
        id: 5,
        optionsWeights: [
            { 16: 5 },
            { 28: 1, 18: 1, 80: 1 },
            {}
        ]
    },
    {
        id: 6,
        optionsWeights: [
            { 35: 2, 16: 2 },
            { 18: 2, 28: 2, 878: 2 },
            { 10765: 1 }
        ]
    },
    {
        id: 7,
        optionsWeights: [
            { 80: 5, 18: 2 },
            { 28: 3, 878: 3, 14: 2 },
            { 10749: 5, 18: 2 },
            { 10752: 5, 36: 3 }
        ]
    },
    {
        id: 8,
        optionsWeights: [
            { 878: 3, 9648: 4, 53: 2 },
            { 18: 5 },
            { 35: 4, 28: 2 }
        ]
    },
    {
        id: 9,
        optionsWeights: [
            { 10402: 10 },
            {}
        ]
    },
    {
        id: 10,
        optionsWeights: [
            { 35: 2, 10751: 3, 10749: 1 },
            { 18: 3, 80: 2 },
            { 9648: 3, 53: 3, 878: 2 }
        ]
    }
];

const QuizPage = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [scores, setScores] = useState<Record<number, number>>({});
    const [showResult, setShowResult] = useState(false);
    const [recommendations, setRecommendations] = useState<(Movie | TVShow)[]>([]);

    const handleAnswer = (optionIndex: number) => {
        const genreWeights = questionLogic[currentQuestion].optionsWeights[optionIndex];
        const newScores = { ...scores };

        Object.entries(genreWeights).forEach(([genreId, weight]) => {
            const id = Number(genreId);
            newScores[id] = (newScores[id] || 0) + weight;
        });
        setScores(newScores);

        if (currentQuestion < t.quiz.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            calculateResults(newScores);
        }
    };

    const calculateResults = (finalScores: Record<number, number>) => {
        const sortedGenres = Object.entries(finalScores)
            .sort(([, weightA], [, weightB]) => weightB - weightA)
            .map(([id]) => Number(id));

        const topGenres = sortedGenres.slice(0, 3);
        const allContent = [...mockMovies, ...mockTVShows];

        let filtered = allContent.filter(item =>
            item.genre_ids.some(id => topGenres.includes(id))
        );

        filtered.sort((a, b) => {
            const aMatches = a.genre_ids.filter(id => topGenres.includes(id)).length;
            const bMatches = b.genre_ids.filter(id => topGenres.includes(id)).length;

            if (aMatches !== bMatches) return bMatches - aMatches;
            return b.vote_average - a.vote_average;
        });

        setRecommendations(filtered.slice(0, 5));
        setShowResult(true);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScores({});
        setShowResult(false);
        setRecommendations([]);
    };

    if (showResult) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{t.quiz.results_title}</h1>
                <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">{t.quiz.results_subtitle}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
                    {recommendations.map((item) => {
                        const isMovie = 'title' in item;
                        const title = isMovie ? (item as Movie).title : (item as TVShow).name;
                        const date = isMovie ? (item as Movie).release_date : (item as TVShow).first_air_date;
                        const year = date ? new Date(date).getFullYear().toString() : '';

                        return (
                            <MovieCard
                                key={item.id}
                                id={item.id}
                                title={title}
                                posterPath={item.poster_path}
                                rating={item.vote_average}
                                type={isMovie ? 'movie' : 'tv'}
                                year={year}
                            />
                        );
                    })}
                </div>

                <div className="flex justify-center gap-4">
                    <Button variant="primary" onClick={resetQuiz}>{t.quiz.restart}</Button>
                    <Button variant="outline" onClick={() => navigate('/')}>{t.quiz.go_home}</Button>
                </div>
            </div>
        );
    }

    const question = t.quiz.questions[currentQuestion];

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-2xl">
                <div className="mb-8 flex justify-between text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                    <span>{t.quiz.question_counter} {currentQuestion + 1} / {t.quiz.questions.length}</span>
                    <span>Recomendador MJI</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold mb-12 text-gray-900 dark:text-white text-center leading-tight">
                    {question.text}
                </h2>

                <div className="grid gap-4">
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="p-6 text-lg text-left rounded-xl bg-white dark:bg-gray-800 border-2 border-transparent hover:border-red-500 hover:shadow-lg dark:hover:shadow-red-900/20 transition-all duration-300 transform hover:-translate-y-1 font-medium text-gray-800 dark:text-gray-200"
                        >
                            {option.text}
                        </button>
                    ))}
                </div>

                <div className="mt-12 w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                    <div
                        className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${((currentQuestion + 1) / t.quiz.questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
