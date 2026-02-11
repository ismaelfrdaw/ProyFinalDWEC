export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    genre_ids: number[];
    video_key?: string;
}

export interface TVShow {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    first_air_date: string;
    genre_ids: number[];
    video_key?: string;
}

export interface SearchResult {
    page: number;
    results: (Movie | TVShow)[];
    total_pages: number;
    total_results: number;
}
