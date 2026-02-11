import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MoviesPage from './pages/MoviesPage';
import DetailsPage from './pages/DetailsPage';
import QuizPage from './pages/QuizPage';

function App() {
  console.log("MJI Films App Initializing...");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="movie/:id" element={<DetailsPage />} />
          <Route path="tv/:id" element={<DetailsPage />} />
          <Route path="*" element={
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-white">
              <h1 className="text-6xl font-black text-red-600 mb-4">404</h1>
              <p className="text-xl text-gray-400">Página no encontrada</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
