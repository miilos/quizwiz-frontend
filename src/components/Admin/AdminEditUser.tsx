import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import Button from "../Button/Button"
import Modal from "../Modal/Modal"
import ErrorModal from "../ErrorModal/ErrorModal"
import { BACKEND_BASE_URI } from "../../config"
import type { AdminUser } from "../../types"

function AdminEditUser() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = location.state?.user as AdminUser | undefined

  const [username, setUsername] = useState(user?.username ?? '')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!user) {
    navigate('/admin')
    return null
  }

  const initials = username.substring(0, 2)

  const handleUpdate = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BACKEND_BASE_URI}/api/admin/account/${user.id}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ username })
    })

    const json = await res.json()

    if (!res.ok) {
      setErrorMessage(json.message)
      return
    }

    setShowSuccessModal(true)
  }

  return (
    <>
      <div className="admin-page admin-page--standalone">
        <div className="admin-page__content">
          <div className="admin-edit-user">
            <div className="my-profile__header">
              <div className="my-profile__avatar">
                <span className="my-profile__avatar__initials">{initials}</span>
              </div>
              <h2 className="admin-edit-user__username">{username}</h2>
            </div>

            <div className="admin-edit-user__fields">
              <div className="form__fields__group">
                <label htmlFor="username" className="form__fields__group__label admin-edit-user__label">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form__fields__group__input admin-edit-user__input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form__fields__group">
                <label htmlFor="email" className="form__fields__group__label admin-edit-user__label">Email</label>
                <input
                  type="text"
                  id="email"
                  className="form__fields__group__input admin-edit-user__input"
                  value={user.email}
                  readOnly
                />
              </div>
            </div>

            <div className="my-profile__actions">
              <Button variant="primary" onClick={handleUpdate}>
                Edit account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <Modal title="Success" onClose={() => { setShowSuccessModal(false); navigate('/admin?tab=users') }}>
          Account updated successfully!
        </Modal>
      )}

      {errorMessage && <ErrorModal message={errorMessage} onClose={() => setErrorMessage('')} />}
    </>
  )
}

export default AdminEditUser
