import { Link } from "react-router";
import type { QuizAttempt, QuizDetails } from "../../types"
import Button from "../Button/Button";
import { BsCheckLg } from "react-icons/bs";

interface QuizResultProps {
  result: QuizAttempt;
  quiz: QuizDetails;
  showBackButton?: boolean;
}

function QuizResults({ result, quiz, showBackButton = true }: QuizResultProps) {
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

  const answersByQuestionId = new Map(
    result.answers.map(a => [Number(a.questionId), a])
  )

  return (
    <>
      <div className="results">
        <h1 className="results__header">Your result is:</h1>

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

        {showBackButton && (
          <Link to={'/quizzes'}>
            <Button variant="secondary">
              Back to quizzes
            </Button>
          </Link>
        )}
      </div>

      <div className="results-review">
        {quiz.questions.map((question) => {
          const answer = answersByQuestionId.get(question.id)
          const isCorrect = answer?.status === 'correct'
          const userAnswers = (answer?.answers ?? []).map(Number)

          return (
            <div
              key={question.id}
              className={`results-review__question results-review__question--${isCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="results-review__header">
                <div className="results-review__header__number">
                  {question.position}.
                </div>
              </div>

              <h3 className="results-review__text">
                {question.text}
              </h3>

              <div className="results-review__options">
                {question.options.map((option, optIdx) => {
                  const isAnswerCorrect = (question.correctAnswer as number[]).includes(optIdx)
                  const isSelected = userAnswers.includes(optIdx)

                  const classes = [
                    'results-review__option',
                    isAnswerCorrect ? 'results-review__option--answer' : 'results-review__option--answer-wrong',
                    isSelected ? 'results-review__option--selected' : ''
                  ].filter(Boolean).join(' ')

                  return (
                    <div className={classes} key={optIdx}>
                      { isAnswerCorrect && <BsCheckLg className="results-review__option__icon" /> }
                      {option}
                    </div>
                  )
                })}
              </div>

              {
                question.explanation &&
                  <p className="results-review__explanation">
                    {question.explanation}
                  </p>
              }
            </div>
          )
        })}
      </div>
    </>
  )
}

export default QuizResults
