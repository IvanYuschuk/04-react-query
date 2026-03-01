
import './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import { useState } from 'react';
import type { Movie } from '../../types/movie';
import toast, { Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

const enterSearchToast = () => toast.error('No movies found for your request.');

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = async (topic: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchMovies(topic);
      setMovies(data);
      if (data.length === 0) {
        enterSearchToast();
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const openMovieModal = (moviesObj: Movie) => {
    setIsModalOpen(true); 
    setSelectedMovie(moviesObj);
  }
  const closeMovieModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  
  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && (<Loader />)}
      {isError && (<ErrorMessage />)}
      {movies.length > 0 && isError === false && isLoading === false && (<MovieGrid movies={movies} onSelect={openMovieModal} />)}
      {isModalOpen && selectedMovie && (<MovieModal onClose={closeMovieModal} movie={selectedMovie} />)}
      <Toaster />
    </>
  )
}

export default App
