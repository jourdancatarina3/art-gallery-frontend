import Image from "next/image";

const artData = [
  {
    title: "Starry Night",
    description: "A famous oil painting by Vincent van Gogh depicting a dreamy interpretation of the night sky.",
    artist: "Vincent van Gogh",
    url: 'https://img.freepik.com/free-vector/watercolor-realistic-landscape-background_23-2147543828.jpg?t=st=1714460908~exp=1714464508~hmac=19bc015c46c4a8cff81779b78a412b0125af2b5019ad88b4c8ab2726a2f4646b&w=740',
    price: 150,
    type: "Painting"
  },
  {
    title: "The Thinker",
    description: "A bronze sculpture by Auguste Rodin depicting a man lost in thought, contemplating life's mysteries.",
    artist: "Auguste Rodin",
    url: 'https://img.freepik.com/free-vector/watercolor-chinese-style-background_52683-96106.jpg?t=st=1714461089~exp=1714464689~hmac=0ec0a2ce896216278394e5252ef09a0083a7d4b9945b68336c3c35083b48e41f&w=740',
    price: 900,
    type: "Sculpture"
  },
  {
    title: "Mona Lisa",
    description: "Perhaps the most famous portrait in the world, painted by Leonardo da Vinci, known for its enigmatic smile.",
    artist: "Leonardo da Vinci",
    url: 'https://img.freepik.com/free-vector/watercolor-autumn-landscape_52683-76386.jpg?t=st=1714461284~exp=1714464884~hmac=1f68bceb9204042ff86c5724dbf3fbe3d0bd62f5873805f4f22eb3bdb1de7ed7&w=996',
    price: 250,
    type: "Painting"
  },
  {
    title: "Les Demoiselles d'Avignon",
    description: "A groundbreaking and controversial painting by Pablo Picasso, showcasing a new form of Cubism.",
    artist: "Pablo Picasso",
    url: 'https://img.freepik.com/free-photo/graffiti-children-bicycle_1122-2206.jpg?t=st=1714461301~exp=1714464901~hmac=ccbf74e606515181e1f549bfabb4ff2a55e10437094614f8a432d5fa4550a2f6&w=900',
    price: 1800,
    type: "Painting"
  },
  {
    title: "Mona Lisa",
    description: "Perhaps the most famous portrait in the world, painted by Leonardo da Vinci, known for its enigmatic smile.",
    artist: "Leonardo da Vinci",
    url: 'https://img.freepik.com/free-vector/watercolor-realistic-landscape-background_23-2147543828.jpg?t=st=1714460908~exp=1714464508~hmac=19bc015c46c4a8cff81779b78a412b0125af2b5019ad88b4c8ab2726a2f4646b&w=740',
    price: 250,
    type: "Painting"
  },
  {
    title: "Les Demoiselles d'Avignon",
    description: "A groundbreaking and controversial painting by Pablo Picasso, showcasing a new form of Cubism.",
    artist: "Pablo Picasso",
    url: 'https://img.freepik.com/free-vector/watercolor-chinese-style-background_52683-96106.jpg?t=st=1714461089~exp=1714464689~hmac=0ec0a2ce896216278394e5252ef09a0083a7d4b9945b68336c3c35083b48e41f&w=740',
    price: 1800,
    type: "Painting"
  }
];

const artistsData = [
  {
    name: "Vincent van Gogh",
    url: "https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?t=st=1714462321~exp=1714465921~hmac=b57f6fe8c87669821675d0134a7d4396cbeaede4e9ff2cb9563856912d317e0e&w=740"
  },
  {
    name: "Leonardo da Vinci",
    url: "https://img.freepik.com/free-photo/portrait-young-girl-smiling_23-2149260597.jpg?t=st=1714462365~exp=1714465965~hmac=59754b9b1adf3ddea05039ac347b13d25744d49aff8d8fb49299ad62c677781e&w=996"
  },
  {
    name: "Pablo Picasso",
    url: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?t=st=1714462460~exp=1714466060~hmac=cbc777779f87a5af1c24be18d65388b94bfba0a30b520691f41f771acfe1d859&w=996"
  },
  {
    name: "Auguste Rodin",
    url: "https://img.freepik.com/free-photo/smiling-young-brunette-caucasian-girl-looks-camera-olive-green_141793-93004.jpg?t=st=1714462476~exp=1714466076~hmac=40b4f61e5c5b1dd41987d6dcf22f172a5827a8801847ec706933241db24bf3a9&w=826"
  },
  {
    name: "Claude Monet",
    url: "https://img.freepik.com/free-photo/portrait-handsome-young-man-with-dark-hair-smiles-happily-expresses-positive-emotions-dressed-casual-turtleneck-hears-good-nes-isolated-brown-background-glad-meet-old-best-friend_273609-61400.jpg?t=st=1714462605~exp=1714466205~hmac=9ff6484d9f4a271f42c30f154f7efedf99c6d734e80ba2e02711ff96fcab8a80&w=996"
  },
  {
    name: "Georgia O'Keeffe",
    url: "https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?t=st=1714462321~exp=1714465921~hmac=b57f6fe8c87669821675d0134a7d4396cbeaede4e9ff2cb9563856912d317e0e&w=740"
  },
  {
    name: "Salvador Dalí",
    url: "https://img.freepik.com/free-photo/portrait-young-girl-smiling_23-2149260597.jpg?t=st=1714462365~exp=1714465965~hmac=59754b9b1adf3ddea05039ac347b13d25744d49aff8d8fb49299ad62c677781e&w=996"
  },
  {
    name: "Frida Kahlo",
    url: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?t=st=1714462460~exp=1714466060~hmac=cbc777779f87a5af1c24be18d65388b94bfba0a30b520691f41f771acfe1d859&w=996"
  },
  {
    name: "Michelangelo",
    url: "https://img.freepik.com/free-photo/smiling-young-brunette-caucasian-girl-looks-camera-olive-green_141793-93004.jpg?t=st=1714462476~exp=1714466076~hmac=40b4f61e5c5b1dd41987d6dcf22f172a5827a8801847ec706933241db24bf3a9&w=826"
  },
  {
    name: "Rembrandt",
    url: "https://img.freepik.com/free-photo/portrait-handsome-young-man-with-dark-hair-smiles-happily-expresses-positive-emotions-dressed-casual-turtleneck-hears-good-nes-isolated-brown-background-glad-meet-old-best-friend_273609-61400.jpg?t=st=1714462605~exp=1714466205~hmac=9ff6484d9f4a271f42c30f154f7efedf99c6d734e80ba2e02711ff96fcab8a80&w=996"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen w-screen pb-72">
      <div className="w-5/6 mx-auto">
        <div className="mt-5">
          <h1 className="font-inter text-5xl">Featured Artwork</h1>
          <div className="flex gap-14 mt-8">
            <div className="w-2/3">
              <div className="relative h-[30rem]">
                <Image
                  src="https://img.freepik.com/free-photo/watercolor-paper-texture-composition_23-2149033900.jpg?t=st=1714458067~exp=1714461667~hmac=385c7c083698a92d9ac54c522e86786765f5f3aa29e8ee0fd98ef5981965e0f7&w=996"
                  alt="art pic"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </div>
            <div className="w-1/3">
              <h1 className="text-4xl font-semibold">The Starry Night</h1>
              <h2 className="mt-2 font-light">Artist: Sheldon Sagrado</h2>
              <h2 className="font-light">Date: April 30, 2024</h2>
              <p className="mt-5 text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="mt-5 text-lg">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              <h2 className="mt-2 text-xl font-bold">Current Bid: $99</h2>
              <div className="flex gap-5 mt-3">
                <button className="bg-black px-8 py-2 text-lg text-white rounded">Bid Now</button>
                <button className="text-lg">Learn More...</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <h1 className="font-inter text-5xl mb-8">New<br />Artworks</h1>
          <div className="flex gap-10 overflow-x-auto">
            {artData.map((art, index) => (
              <div key={index} className="min-w-[335.5px] pb-5">
                <div className="relative h-[344.3px]">
                  <Image src={art.url} alt={art.title} layout="fill" objectFit="cover" className="rounded-md" />
                </div>
                <div className="flex justify-between mt-1.5">
                  <h3 className="text-gray-600 font-light">{art.artist}</h3>
                  <h3 className="text-gray-600 font-light">{art.type}</h3>
                </div>
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold">{art.title}</h3>
                  <h3 className="text-lg font-semibold">${art.price}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32">
          <h1 className="font-inter text-5xl mb-8">Popular Artists</h1>
          <div className="flex gap-10 overflow-x-auto">
            {artistsData.map((artist, index) => (
              <div key={index} className="min-w-[300px] pb-5">
                <div className="relative h-[300px]">
                  <Image src={artist.url} alt='Artist Profile' layout="fill" objectFit="cover" className="rounded-full" />
                </div>
                  <h3 className="text-lg font-semibold text-center mt-3">{artist.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
