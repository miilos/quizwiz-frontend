import { Link } from "react-router"
import Button from "../Button/Button"

function Home() {
  return (
    <>
      <div className="splash splash--learn">
        <div className="splash__section splash__section__learn--left">
          <div className="splash__section__learn--left__img-container">
            <img src="/public/img/splash_1.png" alt="Illustration 1" className="splash__section__learn--left__img-container__img" />
          </div>
        </div>
        <div className="splash__section splash__section__learn--right">
          <div className="splash__container">
            <div className="splash__section__learn--right__header underlined underlined--primary">
              Learn what you love.
            </div>
            <p className="splash__section__learn--right__text">
              Excel in what you love with community-created quizzes, or make your own.
            </p>
            <Link to={'/'}>
              <Button variant="primary">
                Create your own quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="splash splash--ai">
        <div className="splash__section splash__section__ai--left">
          <div className="splash__container">
            <div className="splash__section__ai--left__header underlined underlined--secondary">
              AI-assisted learning.
            </div>
            <p className="splash__section__ai--left__text">
              Get personalized learning reports from our AI learning assistant Merlin. Take a quiz now and get you first learning report.
            </p>
            <Link to={'/quizzes'}>
              <Button variant="secondary">
                Take a quiz now
              </Button>
            </Link>
          </div>
        </div>
        <div className="splash__section splash__section__ai--right">
            <div className="splash__section__ai--right__img-container">
            <img src="/public/img/splash_2.png" alt="Illustration 2" className="splash__section__ai--right__img-container__img" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home