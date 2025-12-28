import { Route, Routes } from "react-router"
import Home from "./Home"
import Navigation from "./Navbar/Navbar"

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
