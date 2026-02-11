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
        const saved = localStorage.getItem('mji_favorites');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error("Error loading favorites:", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('mji_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (item: FavoriteItem) => {
        setFavorites(prev => {
            if (prev.find(f => f.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFavorite = (id: number) => {
        setFavorites(prev => prev.filter(f => f.id !== id));
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
