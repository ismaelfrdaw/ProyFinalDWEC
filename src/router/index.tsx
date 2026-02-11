import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import MoviesPage from '../pages/MoviesPage';
import DetailsPage from '../pages/DetailsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'search',
                element: <SearchPage />,
            },
            {
                path: 'movies',
                element: <MoviesPage />,
            },
            {
                path: 'movie/:id',
                element: <DetailsPage />,
            },
            {
                path: 'tv/:id',
                element: <DetailsPage />,
            },
        ],
    },
]);
