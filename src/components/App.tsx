import { Route, Routes } from "react-router"
import Home from "./Home/Home"
import Navigation from "./Navbar/Navbar"
import Footer from "./Footer/Footer"
import QuizList from "./QuizList/QuizList"
import Layout from "./Layout/Layout"
import QuizDetails from "./QuizDetails/QuizDetails"
import Login from "./Login/Login"
import Signup from "./Signup/Signup"
import RequireAuth from "./RequireAuth/RequireAuth"
import CreateQuiz from "./CreateQuiz/CreateQuiz"
import Profile from "./Profile/Profile"

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
          <Route element={<RequireAuth />}>
            <Route path="create" element={<CreateQuiz />} />
          </Route>
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App
