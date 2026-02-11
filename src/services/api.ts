import axios from 'axios';
import type { Movie, TVShow, SearchResult } from '../types';
import { mockMovies, mockTVShows, mockGenres } from './mockData';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'es-ES',
    },
});

// Helper to check if we should use mock data
const shouldUseMock = () => {
    return !API_KEY || API_KEY.includes('PON_TU_API_KEY') || API_KEY === '';
};

export const getTrending = async (timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<(Movie | TVShow)[]> => {
    if (shouldUseMock()) {
        console.log("Using Mock Data for Trending");
        return [...mockMovies, ...mockTVShows];
    }
    try {
        const response = await api.get<SearchResult>(`/trending/all/${timeWindow}`, { params: { page } });
        return response.data.results;
    } catch (e) {
        console.warn("API Error, falling back to mock:", e);
        return [...mockMovies, ...mockTVShows];
    }
};

export const getPopularMovies = async (page: number = 1): Promise<Movie[]> => {
    if (shouldUseMock()) return mockMovies;
    try {
        const response = await api.get<SearchResult>('/movie/popular', { params: { page } });
        return response.data.results as Movie[];
    } catch (e) {
        return mockMovies;
    }
};

export const getPopularTV = async (page: number = 1): Promise<TVShow[]> => {
    if (shouldUseMock()) return mockTVShows;
    try {
        const response = await api.get<SearchResult>('/tv/popular', { params: { page } });
        return response.data.results as TVShow[];
    } catch (e) {
        return mockTVShows;
    }
};

export const searchMulti = async (query: string): Promise<(Movie | TVShow)[]> => {
    if (shouldUseMock()) {
        const all = [...mockMovies, ...mockTVShows];
        return all.filter(item =>
            ('title' in item ? item.title : item.name).toLowerCase().includes(query.toLowerCase())
        );
    }
    try {
        const response = await api.get<SearchResult>('/search/multi', { params: { query } });
        return response.data.results;
    } catch (e) {
        const all = [...mockMovies, ...mockTVShows];
        return all.filter(item =>
            ('title' in item ? item.title : item.name).toLowerCase().includes(query.toLowerCase())
        );
    }
};

export const getMovieDetails = async (id: number) => {
    if (shouldUseMock()) {
        const movie = mockMovies.find(m => m.id === id);
        return movie ? { ...movie, genres: mockGenres.slice(0, 3) } : null;
    }
    try {
        const response = await api.get(`/movie/${id}`);
        return response.data;
    } catch (e) {
        const movie = mockMovies.find(m => m.id === id);
        return movie ? { ...movie, genres: mockGenres.slice(0, 3) } : null;
    }
};

export const getTVDetails = async (id: number) => {
    if (shouldUseMock()) {
        const tv = mockTVShows.find(t => t.id === id);
        return tv ? { ...tv, genres: mockGenres.slice(0, 3) } : null;
    }
    try {
        const response = await api.get(`/tv/${id}`);
        return response.data;
    } catch (e) {
        const tv = mockTVShows.find(t => t.id === id);
        return tv ? { ...tv, genres: mockGenres.slice(0, 3) } : null;
    }
};

export const discoverMovies = async (genreId?: number, sortBy: string = 'popularity.desc', page: number = 1): Promise<Movie[]> => {
    if (shouldUseMock()) {
        if (genreId) return mockMovies.filter(m => m.genre_ids.includes(genreId));
        return mockMovies;
    }
    try {
        const params: any = { sort_by: sortBy, page };
        if (genreId) params.with_genres = genreId;
        const response = await api.get<SearchResult>('/discover/movie', { params });
        return response.data.results as Movie[];
    } catch (e) {
        if (genreId) return mockMovies.filter(m => m.genre_ids.includes(genreId));
        return mockMovies;
    }
};

export const getUpcomingMovies = async (page: number = 1): Promise<Movie[]> => {
    if (shouldUseMock()) return mockMovies.slice(0, 5);
    try {
        const response = await api.get<SearchResult>('/movie/upcoming', { params: { page } });
        return response.data.results as Movie[];
    } catch (e) {
        return mockMovies.slice(0, 5);
    }
};

export const getTopRated = async (page: number = 1): Promise<Movie[]> => {
    if (shouldUseMock()) return mockMovies.slice().sort((a, b) => b.vote_average - a.vote_average);
    try {
        const response = await api.get<SearchResult>('/movie/top_rated', { params: { page } });
        return response.data.results as Movie[];
    } catch (e) {
        return mockMovies.slice().sort((a, b) => b.vote_average - a.vote_average);
    }
};

export const getGenres = async (): Promise<{ id: number; name: string }[]> => {
    if (shouldUseMock()) return mockGenres;
    try {
        const response = await api.get<{ genres: { id: number; name: string }[] }>('/genre/movie/list');
        return response.data.genres;
    } catch (e) {
        return mockGenres;
    }
};

export const getMovieCredits = async (id: number) => {
    if (shouldUseMock()) return { cast: [] };
    try {
        const response = await api.get(`/movie/${id}/credits`);
        return response.data;
    } catch (e) {
        return { cast: [] };
    }
};

export const getTVCredits = async (id: number) => {
    if (shouldUseMock()) return { cast: [] };
    try {
        const response = await api.get(`/tv/${id}/credits`);
        return response.data;
    } catch (e) {
        return { cast: [] };
    }
};

export const getSimilarMovies = async (id: number): Promise<Movie[]> => {
    if (shouldUseMock()) return mockMovies.slice(0, 5);
    try {
        const response = await api.get<SearchResult>(`/movie/${id}/similar`);
        return response.data.results as Movie[];
    } catch (e) {
        return mockMovies.slice(0, 5);
    }
};

export const getSimilarTV = async (id: number): Promise<TVShow[]> => {
    if (shouldUseMock()) return mockTVShows.slice(0, 5);
    try {
        const response = await api.get<SearchResult>(`/tv/${id}/similar`);
        return response.data.results as TVShow[];
    } catch (e) {
        return mockTVShows.slice(0, 5);
    }
};

export const imageUrl = (path: string | null, size: string = 'w500') => {
    if (!path) return `https://placehold.co/500x750?text=No+Image`;
    if (path.startsWith('http')) return path; // Return absolute URLs as is
    return `https://image.tmdb.org/t/p/${size}${path}`;
};
