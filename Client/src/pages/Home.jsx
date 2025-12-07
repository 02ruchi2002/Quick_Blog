import Navbar from "../components/Navbar"
import Header from "../components/Header"
import BlogList from "../components/Blog-list"
import Newsletter from "../components/NewsLetter"
import Footer from "../components/Footer"

const Home = () =>{
    return(
        <>
        <Navbar/>
        <Header/>
        <BlogList/>
        <Newsletter/>
        <Footer/>
        </>
    )
}

export default Home