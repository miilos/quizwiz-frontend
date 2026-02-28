import { useState } from "react"
import Button from "../Button/Button"
import { BACKEND_BASE_URI } from "../../config"
import { Spinner } from "react-bootstrap"
import { useNavigate } from "react-router"

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  const handleLogInClick = async () => {
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
    }

    const token = json.data.token
    localStorage.setItem('token', token)
    navigate('/quizzes')
  }

  return (
    <>
      <div className="login">
        <div className="login__header">
          <img
            src="/public/img/logo.png"
            alt="QuizWiz logo"
            className="login__header__img"
            width={70}
            height={70}
          />
          <h1 className="login__header__title">Log in</h1>
        </div>

        <div className="login__fields">
          {
            errorMessage &&
              <div className="login__error">
                { errorMessage }
              </div>
          }

          <div className="login__fields__group">
            <label htmlFor="email" className="login__fields__group__label">Email</label>
            <input
              type="text"
              className="login__fields__group__input"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  
            />
          </div>

          <div className="login__fields__group">
            <label htmlFor="password" className="login__fields__group__label">Password</label>
            <input
              type="password"
              className="login__fields__group__input"
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="secondary"
            extraClasses="login__fields__btn"
            onClick={handleLogInClick}
          >
            {
              isLoading &&
                <Spinner animation="border" role="status" className="loader login__loader loader--primary" />
            }
            Log in
          </Button>
        </div>
      </div>
    </>
  )
}

export default Login