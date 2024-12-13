import Header from "../components/Header"
import NavBar from "../components/NavBar"

function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <NavBar/>
    <Header/>
    </div>
  )
}

export default Home
