import { Route, Routes } from "react-router"
import Home from "./Home/Home"
import Navigation from "./Navbar/Navbar"
import Footer from "./Footer/Footer"

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
