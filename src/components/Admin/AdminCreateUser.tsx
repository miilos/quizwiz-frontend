import { useState } from "react"
import { Spinner } from "react-bootstrap"
import Button from "../Button/Button"
import Modal from "../Modal/Modal"
import FormError from "../FormError/FormError"
import { BACKEND_BASE_URI } from "../../config"

interface FieldErrors {
  username?: string
  email?: string
  password?: string
}

function AdminCreateUser() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [modal, setModal] = useState<{ title: string; message: string } | null>(null)

  const handleCreate = async () => {
    const errors: FieldErrors = {}
    if (!username) errors.username = 'Username must be filled out.'
    if (!email) errors.email = 'Email must be filled out.'
    if (!password) errors.password = 'Password must be filled out.'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsLoading(true)

    const res = await fetch(BACKEND_BASE_URI + '/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })

    const json = await res.json()
    setIsLoading(false)

    if (!res.ok) {
      if (json.violations) {
        const backendErrors: FieldErrors = {}
        for (const violation of json.violations) {
          backendErrors[violation.property as keyof FieldErrors] = violation.message
        }
        setFieldErrors(backendErrors)
      } else {
        setModal({ title: 'Error', message: json.message })
      }
      return
    }

    setUsername('')
    setEmail('')
    setPassword('')
    setModal({ title: 'Success', message: 'Account created successfully!' })
  }

  return (
    <>
      <div className="admin-page admin-page--standalone">
        <div className="admin-page__content">
          <div className="form">
            <div className="form__header">
              <img
                src="/public/img/logo.png"
                alt="QuizWiz logo"
                className="form__header__img"
                width={70}
                height={70}
              />
              <h1 className="form__header__title">Create account</h1>
            </div>

            <div className="form__fields">
              <div className="form__fields__group">
                {fieldErrors.username && <FormError>{fieldErrors.username}</FormError>}
                <label htmlFor="username" className="form__fields__group__label">Username</label>
                <input
                  type="text"
                  className="form__fields__group__input"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form__fields__group">
                {fieldErrors.email && <FormError>{fieldErrors.email}</FormError>}
                <label htmlFor="email" className="form__fields__group__label">Email</label>
                <input
                  type="text"
                  className="form__fields__group__input"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form__fields__group">
                {fieldErrors.password && <FormError>{fieldErrors.password}</FormError>}
                <label htmlFor="password" className="form__fields__group__label">Password</label>
                <input
                  type="password"
                  className="form__fields__group__input"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>

              <Button
                variant="secondary"
                extraClasses="form__fields__btn"
                onClick={handleCreate}
              >
                {isLoading && (
                  <Spinner animation="border" role="status" className="loader form__loader loader--primary" />
                )}
                Create account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <Modal title={modal.title} onClose={() => setModal(null)}>
          <p>{modal.message}</p>
        </Modal>
      )}
    </>
  )
}

export default AdminCreateUser
