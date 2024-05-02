"use client"

import React, { createContext, useContext } from 'react';

const ArtDataContext = createContext();

export const ArtDataProvider = ({ children }) => {
  const artData = [
    {
      id: 1,
      title: "Starry Night",
      description: "A famous oil painting by Vincent van Gogh depicting a dreamy interpretation of the night sky.",
      artist: "Vincent van Gogh",
      url: 'https://img.freepik.com/free-vector/watercolor-realistic-landscape-background_23-2147543828.jpg?t=st=1714460908~exp=1714464508~hmac=19bc015c46c4a8cff81779b78a412b0125af2b5019ad88b4c8ab2726a2f4646b&w=740',
      price: 150,
      genre: "Painting"
    },
    {
      id: 2,
      title: "The Thinker",
      description: "A bronze sculpture by Auguste Rodin depicting a man lost in thought, contemplating life's mysteries.",
      artist: "Auguste Rodin",
      url: 'https://img.freepik.com/free-vector/watercolor-chinese-style-background_52683-96106.jpg?t=st=1714461089~exp=1714464689~hmac=0ec0a2ce896216278394e5252ef09a0083a7d4b9945b68336c3c35083b48e41f&w=740',
      price: 900,
      genre: "Sculpture"
    },
    {
      id: 3,
      title: "Mona Lisa",
      description: "Perhaps the most famous portrait in the world, painted by Leonardo da Vinci, known for its enigmatic smile.",
      artist: "Leonardo da Vinci",
      url: 'https://img.freepik.com/free-vector/watercolor-autumn-landscape_52683-76386.jpg?t=st=1714461284~exp=1714464884~hmac=1f68bceb9204042ff86c5724dbf3fbe3d0bd62f5873805f4f22eb3bdb1de7ed7&w=996',
      price: 250,
      genre: "Painting"
    },
    {
      id: 4,
      title: "Les Demoiselles d'Avignon",
      description: "A groundbreaking and controversial painting by Pablo Picasso, showcasing a new form of Cubism.",
      artist: "Pablo Picasso",
      url: 'https://img.freepik.com/free-photo/graffiti-children-bicycle_1122-2206.jpg?t=st=1714461301~exp=1714464901~hmac=ccbf74e606515181e1f549bfabb4ff2a55e10437094614f8a432d5fa4550a2f6&w=900',
      price: 1800,
      genre: "Painting"
    },
    {
      id: 5,
      title: "Mona Lisa",
      description: "Perhaps the most famous portrait in the world, painted by Leonardo da Vinci, known for its enigmatic smile.",
      artist: "Leonardo da Vinci",
      url: 'https://img.freepik.com/free-vector/watercolor-realistic-landscape-background_23-2147543828.jpg?t=st=1714460908~exp=1714464508~hmac=19bc015c46c4a8cff81779b78a412b0125af2b5019ad88b4c8ab2726a2f4646b&w=740',
      price: 250,
      genre: "Painting"
    },
    {
      id: 6,
      title: "Les Demoiselles d'Avignon",
      description: "A groundbreaking and controversial painting by Pablo Picasso, showcasing a new form of Cubism.",
      artist: "Pablo Picasso",
      url: 'https://img.freepik.com/free-vector/watercolor-chinese-style-background_52683-96106.jpg?t=st=1714461089~exp=1714464689~hmac=0ec0a2ce896216278394e5252ef09a0083a7d4b9945b68336c3c35083b48e41f&w=740',
      price: 1800,
      genre: "Painting"
    }
  ];

  return (
    <ArtDataContext.Provider value={artData}>
      {children}
    </ArtDataContext.Provider>
  );
};

export function useArtDataContext() {
  return useContext(ArtDataContext);
}