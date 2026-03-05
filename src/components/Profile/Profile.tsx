import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { Spinner } from "react-bootstrap"
import { BACKEND_BASE_URI } from "../../config"
import { useAppDispatch } from "../../app/hooks"
import { clearUser } from "../../features/userSlice"
import type { ProfileUser } from "../../types"
import MyProfile from "./MyProfile"
import MyLearning from "./MyLearning"
import MyQuizzes from "./MyQuizzes"

type ProfileTab = 'profile' | 'learning' | 'quizzes'

function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')
  const [userData, setUserData] = useState<ProfileUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')

      const res = await fetch(BACKEND_BASE_URI + '/api/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const json = await res.json()

      setUserData(json.data.user)
      setIsLoading(false)
    }
    
    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(clearUser())
    navigate('/')
  }

  if (isLoading) {
    return <Spinner animation="border" role="status" className="loader loader--primary" />
  }

  if (!userData) return null

  return (
    <div className="profile-page">
      <aside className="profile-page__sidebar">
        <button
          className={`profile-page__sidebar__item${activeTab === 'profile' ? ' profile-page__sidebar__item--active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My profile
        </button>
        <button
          className={`profile-page__sidebar__item${activeTab === 'learning' ? ' profile-page__sidebar__item--active' : ''}`}
          onClick={() => setActiveTab('learning')}
        >
          My learning
        </button>
        <button
          className={`profile-page__sidebar__item${activeTab === 'quizzes' ? ' profile-page__sidebar__item--active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          My quizzes
        </button>
      </aside>

      <main className="profile-page__content">
        {activeTab === 'profile' && (
          <MyProfile userData={userData} onLogout={handleLogout} />
        )}
        {activeTab === 'learning' && (
          <MyLearning attempts={userData.quizAttempts} />
        )}
        {activeTab === 'quizzes' && (
          <MyQuizzes quizzes={userData.quizzes} />
        )}
      </main>
    </div>
  )
}

export default Profile
