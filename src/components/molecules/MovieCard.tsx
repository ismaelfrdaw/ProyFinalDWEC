import { Link } from 'react-router-dom';
import { imageUrl } from '../../services/api';
import Badge from '../atoms/Badge';

interface MovieCardProps {
    id: number;
    title: string;
    posterPath: string;
    rating: number;
    type: 'movie' | 'tv';
    year?: string;
}

import { useLanguage } from '../../context/LanguageContext';

const MovieCard: React.FC<MovieCardProps> = ({ id, title, posterPath, rating, type, year }) => {
    const { t } = useLanguage();

    const linkPath = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;

    // Color rating based on score
    const getRatingColor = (score: number) => {
        if (score >= 7) return 'text-green-400 border-green-400';
        if (score >= 5) return 'text-yellow-400 border-yellow-400';
        return 'text-red-400 border-red-400';
    };

    return (
        <Link to={linkPath} className="group relative block bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/10 border border-gray-100 dark:border-gray-700">
            <div className="aspect-[2/3] w-full overflow-hidden bg-gray-200 dark:bg-gray-900 relative">
                <img
                    src={imageUrl(posterPath, 'w500')}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/500x750?text=${encodeURIComponent(title)}`;
                    }}
                />
                <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/80 text-xs font-bold border-2 ${getRatingColor(rating)}`}>
                        {rating.toFixed(1)}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[2.5em] transition-colors">{title}</h3>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 transition-colors">
                    <span>{year || 'N/A'}</span>
                    <Badge variant="outline">{type === 'movie' ? t.details.movie : t.details.tv}</Badge>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
