import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "./axios";
import "./Row.css";
import movieTrailer from "movie-trailer"


const baseImgUrl = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(""); 
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie)=>{
    if(trailerUrl)
    {
      setTrailerUrl('');
    }
    else{
      movieTrailer(movie?.name || "")
      .then(url=>{
        const urlparams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlparams.get('v'));
      }).catch((error)=>console.log(error));
    }
  }


  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

 

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row_posters">
        {movies.map(
          (movie) =>
            movie.backdrop_path !== null && (
              <img onClick={
                ()=>handleClick(movie)
              }
              key={movie.id}
                className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                src={`${baseImgUrl}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
               />
            )
        )}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}  />}
      
    </div>
  );
}

export default Row;