import axios from "axios"
import type { Movie } from "../types/movie";

const myTMDBToken = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesResponse{
  results: Movie[];
  total_pages: number;
  page: number;
}

export const fetchMovies = async (movie: string, page: number) => {
    const options = {
        params: {
          query: movie,
          include_adult: false,
          language: 'en-US',
          page,
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${myTMDBToken}`
        }
    };
    const response = await axios.get<MoviesResponse>(`https://api.themoviedb.org/3/search/movie`, options);
    return response.data;
}
