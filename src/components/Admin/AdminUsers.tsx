import { useState, useEffect } from "react"
import type React from "react"
import { useNavigate } from "react-router"
import { Spinner } from "react-bootstrap"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import { BACKEND_BASE_URI } from "../../config"
import Button from "../Button/Button"
import ErrorModal from "../ErrorModal/ErrorModal"
import type { AdminUser } from "../../types"

function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token')
      const res = await fetch(BACKEND_BASE_URI + '/api/account/list', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const json = await res.json()
      setUsers(json.data.users)
      setIsLoading(false)
    }

    fetchUsers()
  }, [])

  const handleEdit = (e: React.MouseEvent, user: AdminUser) => {
    e.stopPropagation()
    navigate(`/admin/users/${user.id}/edit`, { state: { user } })
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')
    const res = await fetch(`${BACKEND_BASE_URI}/api/account/${id}/delete`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      setErrorMessage('Error deleting account')
      return
    }
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  if (isLoading) return <Spinner animation="border" role="status" className="loader loader--primary" />

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <h2 className="admin-users__title">Users</h2>
        <Button variant="primary" onClick={() => navigate('/admin/users/create')}>
          Add account
        </Button>
      </div>

      <div className="admin-users__list">
        {users.map((user) => (
          <div key={user.id} className="admin-users__card">
            <div>
              <p className="admin-users__card__username">{user.username}</p>
              <p className="admin-users__card__email">{user.email}</p>
              <div className="admin-users__card__stats">
                <span>{user.quizzes.length} quizzes</span>
                <span>{user.quizAttempts.length} attempts</span>
              </div>
            </div>
            <div className="quiz-actions" onClick={(e) => e.stopPropagation()}>
              <FiEdit2 className="quiz-actions__icon" onClick={(e) => handleEdit(e, user)} />
              <FiTrash2 className="quiz-actions__icon" onClick={(e) => handleDelete(e, user.id)} />
            </div>
          </div>
        ))}
      </div>

      {errorMessage && <ErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />}
    </div>
  )
}

export default AdminUsers
