import { useEffect } from "react"
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
import EditQuiz from "./EditQuiz/EditQuiz"
import Profile from "./Profile/Profile"
import AttemptPage from "./AttemptPage/AttemptPage"
import Admin from "./Admin/Admin"
import AdminEditUser from "./Admin/AdminEditUser"
import AdminCreateUser from "./Admin/AdminCreateUser"
import ForgotPassword from "./ForgotPassword/ForgotPassword"
import ResetPassword from "./ResetPassword/ResetPassword"
import TagQuizList from "./TagQuizList/TagQuizList"
import { useAppDispatch } from "../app/hooks"
import { setUser } from "../features/userSlice"
import { BACKEND_BASE_URI } from "../config"

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) return

    const hydrate = async () => {
      const res = await fetch(BACKEND_BASE_URI + '/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const json = await res.json()
      dispatch(setUser(json.data.user))
    }

    hydrate()
  }, [])

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/tag/:id" element={<TagQuizList />} />
        </Route>

        <Route path="/quizzes" element={<Layout />}>
          <Route index element={<QuizList />} />
          <Route path=":id" element={<QuizDetails />} />
          <Route element={<RequireAuth />}>
            <Route path="create" element={<CreateQuiz />} />
            <Route path=":id/edit" element={<EditQuiz />} />
          </Route>
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/attempts/:id" element={<AttemptPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users/:id/edit" element={<AdminEditUser />} />
          <Route path="/admin/users/create" element={<AdminCreateUser />} />
        </Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App
