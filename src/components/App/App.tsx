
import './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import { useState } from 'react';
import type { Movie } from '../../types/movie';
import  { toast, Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from "./App.module.css";
import ReactPaginate from 'react-paginate';


const enterSearchToast = () => toast.error('No movies found for your request.');

function App() {
  const [topic, setTopic] = useState('');
  const [page, setPage] = useState(1);

  const  { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['movies', topic, page],
    queryFn: () => fetchMovies(topic, page),
    enabled: topic !== '',
    placeholderData: keepPreviousData,
  })
  
  if (data && data?.results.length === 0) {
    enterSearchToast();
  }
  const totalPages = data?.total_pages ?? 0;  

  const handleSearch = async (newTopic: string) => {
    setTopic(newTopic);
    setPage(1);
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
      {isSuccess && totalPages > 1 && (<ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
      />)}
      { isLoading && (<Loader />) }
      { isError && (<ErrorMessage />) }
      { data && data.results.length > 0 && isError === false && isLoading === false && (<MovieGrid movies={data.results} onSelect={openMovieModal} />) }
      { isModalOpen && selectedMovie && (<MovieModal onClose={closeMovieModal} movie={selectedMovie} />) }
      <Toaster />
    </>
  )
}

export default App
