import { Route, Routes } from "react-router"
import Home from "./Home/Home"
import Navigation from "./Navbar/Navbar"
import Footer from "./Footer/Footer"
import QuizList from "./QuizList/QuizList"
import Layout from "./Layout/Layout"

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<Layout />}>
          <Route path="/quizzes" element={<QuizList />} />
        </Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App
