import { ArtDataProvider } from '../context/ArtDataContext'
 
export default function Layout({ children }) {
  return (
    <>
      <ArtDataProvider>
        {children}
      </ArtDataProvider>
    </>
  )
}