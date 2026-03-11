import { useState } from "react"
import { Spinner } from "react-bootstrap"
import { useNavigate } from "react-router"
import Button from "../Button/Button"
import Modal from "../Modal/Modal"
import { BACKEND_BASE_URI } from "../../config"

function ResetPassword() {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleResetPassword = async () => {
    setIsLoading(true)

    const res = await fetch(BACKEND_BASE_URI + '/api/account/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    })

    const json = await res.json()

    setIsLoading(false)

    if (!res.ok) {
      setErrorMessage(json.message)
      return
    }

    navigate('/login')
  }

  return (
    <>
      {errorMessage && (
        <Modal title="Error" onClose={() => setErrorMessage(null)}>
          <p>{errorMessage}</p>
        </Modal>
      )}

      <div className="form">
        <div className="form__header">
          <img
            src="/public/img/logo.png"
            alt="QuizWiz logo"
            className="form__header__img"
            width={70}
            height={70}
          />
          <h1 className="form__header__title">Reset password</h1>
        </div>

        <div className="form__fields">
          <div className="form__fields__group">
            <label htmlFor="reset-token" className="form__fields__group__label">Reset token</label>
            <input
              type="text"
              className="form__fields__group__input"
              id="reset-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <div className="form__fields__group">
            <label htmlFor="new-password" className="form__fields__group__label">New password</label>
            <input
              type="password"
              className="form__fields__group__input"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
            />
          </div>

          <Button
            variant="secondary"
            extraClasses="form__fields__btn"
            onClick={handleResetPassword}
          >
            {isLoading && (
              <Spinner animation="border" role="status" className="loader form__loader loader--primary" />
            )}
            Reset password
          </Button>
        </div>
      </div>
    </>
  )
}

export default ResetPassword
