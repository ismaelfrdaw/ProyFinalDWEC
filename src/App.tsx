import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MoviesPage from './pages/MoviesPage';
import DetailsPage from './pages/DetailsPage';
import QuizPage from './pages/QuizPage';

function App() {
  console.log("App Rendering..."); // Debug log
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
          <Route path="*" element={<div className="p-10 text-white">404 - Página no encontrada</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
