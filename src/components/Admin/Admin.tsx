import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { Spinner } from "react-bootstrap"
import { BACKEND_BASE_URI } from "../../config"
import AdminUsers from "./AdminUsers"
import AdminQuizzes from "./AdminQuizzes"

type AdminTab = 'users' | 'quizzes'

function Admin() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as AdminTab) ?? 'users'
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    const checkAdmin = async () => {
      const res = await fetch(BACKEND_BASE_URI + '/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const json = await res.json()

      if (!res.ok || !json.data.user.roles.includes('ROLE_ADMIN')) {
        navigate('/login')
        return
      }

      setIsLoading(false)
    }

    checkAdmin()
  }, [])

  if (isLoading) return <Spinner animation="border" role="status" className="loader loader--primary" />

  return (
    <div className="admin-page">
      <aside className="admin-page__sidebar">
        <button
          className={`admin-page__sidebar__item${activeTab === 'users' ? ' admin-page__sidebar__item--active' : ''}`}
          onClick={() => setSearchParams({ tab: 'users' })}
        >
          Users
        </button>
        <button
          className={`admin-page__sidebar__item${activeTab === 'quizzes' ? ' admin-page__sidebar__item--active' : ''}`}
          onClick={() => setSearchParams({ tab: 'quizzes' })}
        >
          Quizzes
        </button>
      </aside>

      <main className="admin-page__content">
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'quizzes' && <AdminQuizzes />}
      </main>
    </div>
  )
}

export default Admin
