import Navbar from '@/components/generics/navbar'
import LoginPane from '@/components/auth/LoginPane';

export const metadata = {
    title: "FASO GALLERY | login",
    description: "Login to FASO GALLERY to start bidding on your favorite artworks.",
};

function Page() {
    return (
        <>
            <div className='absolute top-0 left-0'>
                <Navbar />
            </div>
            <main className="flex justify-center items-center font-Adamina h-lvh">
                <LoginPane />
            </main>
        </>
    )
}

export default Page