
import Navbar from '@/components/generics/navbar';
import Footer from '@/components/generics/Footer';
import ArtworkPane from '@/components/artworks/ArtworkPane';

export const metadata = {
  title: 'FASO GALLERY | Artworks',
  description: 'Discover and bid on your favorite artworks.',
};

const ArtworksPage = () => {
  return (
    <>
      <Navbar />
      <ArtworkPane />
      <Footer />
    </>
  );
};

export default ArtworksPage;
