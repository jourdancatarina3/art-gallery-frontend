
import Navbar from '@/components/generics/navbar';
import Footer from '@/components/generics/Footer';
import ArtworkPane from '@/components/artworks/ArtworkPane';

export const metadata = {
  title: 'Artworks | FASO GALLERY',
  description: 'Discover and bid on your favorite artworks.',
};

const ArtworksPage = () => {
  return (
    <div className='max-w-screen overflow-x-hidden'>
      <Navbar />
      <ArtworkPane />
      <Footer />
    </div>
  );
};

export default ArtworksPage;
