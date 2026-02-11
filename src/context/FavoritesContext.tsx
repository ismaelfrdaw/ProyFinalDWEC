import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FavoriteItem {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    media_type: 'movie' | 'tv';
    release_date?: string;
}

interface FavoritesContextType {
    favorites: FavoriteItem[];
    addFavorite: (item: FavoriteItem) => void;
    removeFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    useEffect(() => {
        // Load only once on mount
        const saved = localStorage.getItem('mji_favorites');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setFavorites(parsed);
                }
            } catch (e) {
                console.error("Error loading favorites:", e);
            }
        }
    }, []);

    const addFavorite = (item: FavoriteItem) => {
        setFavorites(prev => {
            if (prev.find(f => f.id === item.id)) return prev;
            const updated = [...prev, item];
            localStorage.setItem('mji_favorites', JSON.stringify(updated));
            return updated;
        });
    };

    const removeFavorite = (id: number) => {
        setFavorites(prev => {
            const updated = prev.filter(f => f.id !== id);
            localStorage.setItem('mji_favorites', JSON.stringify(updated));
            return updated;
        });
    };

    const isFavorite = (id: number) => {
        return favorites.some(f => f.id === id);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
