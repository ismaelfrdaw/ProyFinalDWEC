import React from 'react';
import MovieCard from '../molecules/MovieCard';
import type { Movie, TVShow } from '../../types';

interface MovieGridProps {
    items: (Movie | TVShow)[];
    title?: string;
    loading?: boolean;
}

import { useLanguage } from '../../context/LanguageContext';

const MovieGrid: React.FC<MovieGridProps> = ({ items, title, loading = false }) => {
    const { t } = useLanguage();

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                ))}
            </div>
        );
    }

    return (
        <section className="py-8">
            {title && <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-l-4 border-red-600 pl-4">{title}</h2>}

            {items.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-10">{t.search.no_results}</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {items.map((item) => {
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
            )}
        </section>
    );
};

export default MovieGrid;
