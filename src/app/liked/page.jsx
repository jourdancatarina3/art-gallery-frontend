import Navbar from "@/components/generics/navbar";
import Footer from "@/components/generics/Footer";
import LikedPane from "@/components/Liked/LikedPane";

export const metadata = {
    title: "Liked Artworks | FASO GALLERY",
    description: "View all the artworks you have liked.",
};

function LikedPage() {
    return (
        <div>
            <Navbar />
            <LikedPane />
            <Footer />
        </div>
    )
}

export default LikedPage