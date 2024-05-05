import Navbar from '@/components/generics/navbar';
import NewArtworkPane from '@/components/artworks/NewArtworkPane';

export const metadata = {
    title: 'FASO GALLERY | New Artwork',
    description: 'Create a new artwork.',
};

function page() {
    return (
    <>
        <Navbar />
        <NewArtworkPane />
    </>
    )
}

export default page