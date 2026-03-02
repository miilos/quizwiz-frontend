import { useState } from "react"
import Button from "../Button/Button"
import { BACKEND_BASE_URI } from "../../config"
import { Spinner } from "react-bootstrap"
import { useNavigate } from "react-router"
import { useAppDispatch } from "../../app/hooks"
import { setUser } from "../../features/userSlice"
import FormError from "../FormError/FormError"

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const handleLogIn = async () => {
    setIsLoading(true)

    const res = await fetch(
      BACKEND_BASE_URI + '/api/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    )

    const json = await res.json()

    setIsLoading(false)

    if (!res.ok) {
      setErrorMessage(json.message)
      return
    }

    const token = json.data.token
    localStorage.setItem('token', token)

    dispatch(setUser(json.data.user))

    navigate('/quizzes')
  }

  return (
    <>
      <div className="form">
        <div className="form__header">
          <img
            src="/public/img/logo.png"
            alt="QuizWiz logo"
            className="form__header__img"
            width={70}
            height={70}
          />
          <h1 className="form__header__title">Log in</h1>
        </div>

        <div className="form__fields">
          {
            errorMessage &&
              <FormError>
                { errorMessage }
              </FormError>
          }

          <div className="form__fields__group">
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
            <label htmlFor="password" className="form__fields__group__label">Password</label>
            <input
              type="password"
              className="form__fields__group__input"
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogIn()}
            />
          </div>

          <Button
            variant="secondary"
            extraClasses="form__fields__btn"
            onClick={handleLogIn}
          >
            {
              isLoading &&
                <Spinner animation="border" role="status" className="loader form__loader loader--primary" />
            }
            Log in
          </Button>
        </div>
      </div>
    </>
  )
}

export default Login