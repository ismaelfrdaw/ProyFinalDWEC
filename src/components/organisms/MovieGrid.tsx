import React from 'react';
import MovieCard from '../molecules/MovieCard';
import type { Movie, TVShow } from '../../types';

import type { FavoriteItem } from '../../context/FavoritesContext';

interface MovieGridProps {
    items: (Movie | TVShow | FavoriteItem)[];
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
                        // Check if it's already a FavoriteItem (has media_type)
                        const isFav = 'media_type' in item;
                        const isMovie = isFav ? (item as FavoriteItem).media_type === 'movie' : 'title' in item;

                        const title = isFav
                            ? (item as FavoriteItem).title
                            : (isMovie ? (item as Movie).title : (item as TVShow).name);

                        const date = isFav
                            ? (item as FavoriteItem).release_date
                            : (isMovie ? (item as Movie).release_date : (item as TVShow).first_air_date);

                        const type = isFav
                            ? (item as FavoriteItem).media_type
                            : (isMovie ? 'movie' : 'tv');

                        const year = date ? (date.includes('-') ? new Date(date).getFullYear().toString() : date) : '';

                        return (
                            <MovieCard
                                key={`${type}-${item.id}`}
                                id={item.id}
                                title={title}
                                posterPath={item.poster_path}
                                rating={isFav ? (item as FavoriteItem).vote_average : item.vote_average}
                                type={type as 'movie' | 'tv'}
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
