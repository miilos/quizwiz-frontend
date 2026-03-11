import { useState } from "react"
import { Spinner } from "react-bootstrap"
import Button from "../Button/Button"
import Modal from "../Modal/Modal"
import { BACKEND_BASE_URI } from "../../config"
import { useNavigate } from "react-router"

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [modal, setModal] = useState<{ title: string; message: string } | null>(null)
  
  const navigate = useNavigate()

  const handleForgotPassword = async () => {
    setIsLoading(true)

    const res = await fetch(BACKEND_BASE_URI + '/api/account/password/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    const json = await res.json()

    setIsLoading(false)

    if (!res.ok) {
      setModal({ title: 'Error', message: json.message })
      return
    }

    navigate('/reset-password')
  }

  return (
    <>
      {modal && (
        <Modal title={modal.title} onClose={() => setModal(null)}>
          <p>{modal.message}</p>
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
          <h1 className="form__header__title">Forgot password</h1>
        </div>

        <div className="form__fields">
          <div className="form__fields__group">
            <label htmlFor="email" className="form__fields__group__label">Email</label>
            <input
              type="text"
              className="form__fields__group__input"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()}
            />
          </div>

          <Button
            variant="secondary"
            extraClasses="form__fields__btn"
            onClick={handleForgotPassword}
          >
            {isLoading && (
              <Spinner animation="border" role="status" className="loader form__loader loader--primary" />
            )}
            Send reset email
          </Button>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
