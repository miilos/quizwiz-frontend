import { Nav, Navbar } from "react-bootstrap"
import { FaBars } from "react-icons/fa"
import { useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router"

function Navigation() {
  const user = useAppSelector((state) => state.user)

  const navigate = useNavigate()

  const handleProfileClick = () => {
    navigate('/profile')
  }

  return (
    <>
      <Navbar className="nav" expand="md">
          <Navbar.Brand href="/" className="nav__logo">
            <img
              src="/public/img/logo.png"
              width={70}
              height={70}
              alt="QuizWiz logo"
            />
            <h1 className="nav__logo__text">
              QuizWiz
            </h1>
          </Navbar.Brand>

          <Navbar.Toggle>
            <FaBars color="#FAF5EB" size={24} />
          </Navbar.Toggle>

          <Navbar.Collapse>
            <Nav className="nav__items">
              <Nav.Link href="/quizzes" className="nav__item">Browse Quizzes</Nav.Link>
              <Nav.Link href="/quizzes/create" className="nav__item">Create a Quiz</Nav.Link>
              <Nav.Link href="/" className="nav__item">Item 3</Nav.Link>
              <Nav.Link href="/" className="nav__item">Item 4</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <Navbar.Collapse className="nav__account-actions">
            {
              user.username ?
                <div
                  className="nav__profile"
                  onClick={handleProfileClick}
                >
                  { user.username.substring(0, 2) }
                </div>
                :
                <Nav className="nav__account-actions-container">
                  <Nav.Link href="/signup" className="nav__item nav__account-actions__signup">Sign up</Nav.Link>
                  <Nav.Link href="/login" className="nav__item nav__account-actions__login">Log in</Nav.Link>
                </Nav>
            }
          </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Navigation