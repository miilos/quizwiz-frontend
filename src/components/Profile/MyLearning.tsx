import { Link } from "react-router"
import type { ProfileQuizAttempt } from "../../types"

interface MyLearningProps {
  attempts: ProfileQuizAttempt[]
}

function MyLearning({ attempts }: MyLearningProps) {
  if (attempts.length === 0) {
    return <p className="my-learning__empty">You haven't attempted any quizzes yet.</p>
  }

  return (
    <div className="my-learning">
      <h2 className="my-learning__title">My learning</h2>
      <div className="my-learning__list">
        {attempts.map((attempt) => (
          <Link key={attempt.id} to={`/attempts/${attempt.id}`} className="my-learning__card">
            <div className="my-learning__card__score">
              <span className="my-learning__card__score__number">{attempt.percentageScore}%</span>
            </div>
            <div className="my-learning__card__info">
              <p className="my-learning__card__info__title">{attempt.quiz.title}</p>
              <p className="my-learning__card__info__date">
                {
                  (() => {
                    const d = new Date(attempt.attemptedAt);
                    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}.`
                  })()
                }
              </p>
              <p className="my-learning__card__info__counts">
                <span className="my-learning__card__info__counts__correct">✓ {attempt.correctAnswerCount} correct</span>
                <span className="my-learning__card__info__counts__incorrect">✗ {attempt.incorrectAnswerCount} incorrect</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default MyLearning
