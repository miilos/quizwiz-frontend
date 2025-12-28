import { Nav, Navbar } from "react-bootstrap"
import { FaBars } from "react-icons/fa"

function Navigation() {
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
              <Nav.Link href="/" className="nav__item">Item 1</Nav.Link>
              <Nav.Link href="/" className="nav__item">Item 2</Nav.Link>
              <Nav.Link href="/" className="nav__item">Item 3</Nav.Link>
              <Nav.Link href="/" className="nav__item">Item 4</Nav.Link>
            </Nav>
          </Navbar.Collapse>
      </Navbar> 
    </>
  )
}

export default Navigation