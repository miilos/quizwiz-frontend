import { Link } from "react-router";
import type { QuizAttempt } from "../../types"
import Button from "../Button/Button";

interface QuizResultProps {
  result: QuizAttempt;
}

function QuizResults({ result }: QuizResultProps) {
  const mapPercentageScoreToMessage = (percentageScore: number): string => {
    switch (true) {
      case percentageScore <= 10:
        return 'You\'ll do better next time!'
      case percentageScore > 10 && percentageScore <= 40:
        return 'You\'re on the right track! Keep going!'
      case percentageScore > 40 && percentageScore <= 75:
        return 'You did good! You\'ll do even better next time!'
      case percentageScore > 75 && percentageScore <= 90:
        return 'Good job! You did great!'
      case percentageScore > 90:
        return 'Aced it! Keep going!'
      default:
        return 'You did good! Keep going!'
    }
  }

  return (
    <>
      <div className="results">
        <div className="results__percentage">
          <h1 className="results__percentage__text">
            { result.percentageScore }%
          </h1>
        </div>

        <div className="results__text">
          <p className="results__text__p">You got:</p>
          <p className="results__text__correct-count">
            { result.correctAnswerCount } / { result.correctAnswerCount + result.incorrectAnswerCount }
          </p>
          <p className="results__text__p">questions correct</p>
          <p className="results__text__p results__text__p--score-message">
            { mapPercentageScoreToMessage(result.percentageScore) }
          </p>
        </div>

        <Link to={'/quizzes'}>
          <Button variant="primary">
            Back to quizzes
          </Button>
        </Link>
      </div>
    </>
  )
}

export default QuizResults