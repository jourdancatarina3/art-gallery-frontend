"use client";

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useArtDataContext } from '../context/ArtDataContext';
import Navbar from '@/components/generics/navbar';
import ArtworkCard from '@/components/artworks/ArtworkCard';

const artGenres = [
  "Painting",
  "Sculpture",
  "Expressionism",
  "Surrealism",
  "Realism",
  "Cubism",
  "Renaissance",
  "Modernism"
];

const ArtworksPage = () => {
  const artData = useArtDataContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState(artData);

  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value.trim().toLowerCase());

    if (value.trim().length >= 3) {
      const genreFilteredArtworks = applyGenreFilter(artData);
      const searchFilteredArtworks = applySearchFilter(genreFilteredArtworks, value.trim().toLowerCase());
      setFilteredArtworks(searchFilteredArtworks);
    } else {
      setFilteredArtworks(applyGenreFilter(artData));
    }
  };

  const handleGenreChange = (genre) => {
    const currentIndex = selectedGenres.indexOf(genre);
    const newSelectedGenres = [...selectedGenres];

    if (currentIndex === -1) {
      newSelectedGenres.push(genre);
    } else {
      newSelectedGenres.splice(currentIndex, 1);
    }

    setSelectedGenres(newSelectedGenres);

    const genreFilteredArtworks = applyGenreFilter(artData, newSelectedGenres);
    const searchFilteredArtworks = applySearchFilter(genreFilteredArtworks, searchQuery);
    setFilteredArtworks(searchFilteredArtworks);
  };

  const applyGenreFilter = (artworks, genres = selectedGenres) => {
    if (genres.length === 0) {
      return artworks;
    }
    return artworks.filter((art) => genres.some((genre) => art.genre.includes(genre)));
  };

  const applySearchFilter = (artworks, query) => {
    return artworks.filter((art) => art.title.toLowerCase().includes(query));
  };

  const handleSearch = () => {
    handleSearchInputChange({ target: { value: searchQuery } });
  };

  return (
    <>
      <Navbar />
      <div className='container xl mx-auto'>
        <div className='flex gap-3 mt-3 font-light'>
          <h1>Home</h1>
          <h1>/</h1>
          <h1 className='font-semibold'>Artworks</h1>
        </div>
        <div className='flex'>
          <div className='w-[15%]'>
            <h3 className='text-2xl font-semibold mt-20'>Filters</h3>
            <hr className="border-0 h-px bg-gray-300 my-5" />
            <div className='flex flex-col gap-5'>
              {artGenres.map((genre) => (
                <div className='flex gap-3 items-center' key={genre}>
                  <input
                    type='checkbox'
                    className='w-5 h-5 hover:cursor-pointer'
                    checked={selectedGenres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                  />
                  <h4 className='text-md tracking-widest'>{genre}</h4>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-5 ml-10 w-[85%]'>
            <h1 className='text-3xl font-semibold'>ARTWORKS</h1>
            <div className='bg-gray-200 py-3.5 flex rounded mt-2 w-96'>
              <div className='px-4 cursor-pointer' onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} width={20} height={20} />
              </div>
              <input
                className='focus placeholder-gray-700 focus:outline-none bg-gray-200 w-96'
                placeholder='Search Artwork'
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            <div className='mt-10 flex gap-5 flex-wrap'>
              {filteredArtworks.map((art, index) => (
                <ArtworkCard key={index} art={art} />
              ))}
              {filteredArtworks.map((art, index) => (
                <ArtworkCard key={index} art={art} />
              ))}
              {filteredArtworks.map((art, index) => (
                <ArtworkCard key={index} art={art} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtworksPage;
