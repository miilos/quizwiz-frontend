import { Route, Routes } from "react-router"
import Home from "./Home/Home"
import Navigation from "./Navbar/Navbar"
import Footer from "./Footer/Footer"
import QuizList from "./QuizList/QuizList"
import Layout from "./Layout/Layout"
import QuizDetails from "./QuizDetails/QuizDetails"
import Login from "./Login/Login"
import Signup from "./Signup/Signup"

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/quizzes" element={<Layout />}>
          <Route index element={<QuizList />} />
          <Route path=":id" element={<QuizDetails />} />
        </Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App
