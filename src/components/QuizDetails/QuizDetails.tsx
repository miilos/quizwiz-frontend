import { gql } from "@apollo/client"
import { useMutation, useQuery } from "@apollo/client/react"
import { Spinner } from "react-bootstrap"
import { Link, useParams } from "react-router"
import type { AttemptRef, QuizDetails as QuizDetailsType, QuizAttempt as QuizAttemptType, Tag as TagType } from "../../types"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import Tag from "../Tag/Tag"
import { useState } from "react"
import StartQuizButton from "../StartQuizButton/StartQuizButton"
import QuizAttempt from "../QuizAttempt/QuizAttempt"
import QuizResults from "../QuizResults/QuizResults"
import ErrorHandler from "../../util/ErrorHandler"
import ErrorModal from "../ErrorModal/ErrorModal"

interface GetQuizResult {
  quiz: QuizDetailsType;
}

interface CreateQuizAttemptResult {
  createAttempt: QuizAttemptType;
}

type QuizAttemptState = 'notStarted' | 'started' | 'finished'

const GET_QUIZ = gql`
  query GetQuiz($id: Int!) {
    quiz(id: $id) {
      id
      title
      description
      createdAt
      tags {
        id
        name
        displayName
      }
      questions {
        id
        text
        options
        correctAnswer
        type
        position
        explanation
      }
      author {
        id
        username
      }
    }
  }
`

const CREATE_ATTEMPT = gql`
  mutation CreateAttempt($attempt: QuizAttemptInput) {
    createAttempt(attempt: $attempt) {
      id
      quiz {
        id
        title
      }
      user {
        id
        username
      }
      answers {
        questionId
        answers
        status
      }
      correctAnswerCount
      incorrectAnswerCount
      percentageScore
      attemptedAt
    }
  }
`

function QuizDetails() {
  const [attemptState, setAttemptState] = useState<QuizAttemptState>('notStarted')
  const [showNotLoggedInError, setShowNotLoggedInError] = useState(false)

  let { id } = useParams()

  const [
    createAttemptMutation,
    {
      data: createAttemptData,
      loading: createAttemptLoading,
      error: createAttemptError
    }
  ] = useMutation<CreateQuizAttemptResult>(
    CREATE_ATTEMPT, {
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    })

  const handleStartBtnClick = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setShowNotLoggedInError(true)
      return
    }

    setAttemptState('started')
  }

  const handleEndQuizClick = (attempt: AttemptRef) => {
    createAttemptMutation({ variables: { attempt } })
    setAttemptState('finished')
  }

  if (!id) {
    return <div>Quiz with id {id} not found</div>
  }

  const { loading, error, data } = useQuery<GetQuizResult>(GET_QUIZ, {
    variables: { id: parseInt(id) }
  })

  if (loading) {
    return (
      <Spinner animation="border" role="status" className="loader loader--primary" />
    )
  }

  if (error) {
    return <ErrorModal message={error.message} />
  }

  const quiz = data?.quiz

  if (!quiz) {
    return <></>
  }

  return (
    <>
      <div className="quiz quiz-details">
        <div className="quiz__main-info">
          <h3 className="quiz__main-info__title">
            { quiz.title }
          </h3>
          <p className="quiz__main-info__author">
            by:
            <Link to={'/'} className="quiz__main-info__author__link">
              { quiz.author.username }
            </Link>
          </p>
          { 
            quiz.description &&
            <p className="quiz__main-info__description">
              { quiz.description }
            </p>
          }
        </div>

        <div className="quiz__secondary-info">
          <p className="quiz__secondary-info__num-questions">
            <BsFillPatchQuestionFill  className="quiz__secondary-info__num-questions__icon" />
            { quiz.questions.length }
          </p>

          {
            quiz.tags &&
            <div className="quiz__secondary-info__tags-container">
              { quiz.tags.map(
                  (tag: TagType) => <Tag tag={tag} key={tag.id} />
                )
              }
            </div>
          } 
        </div>
      </div>

      {
        attemptState === 'notStarted' && <StartQuizButton onClick={handleStartBtnClick} />
      }

      {
        attemptState === 'started' &&
          <QuizAttempt
            quiz={quiz}
            onEndQuiz={handleEndQuizClick}
            submitLoading={createAttemptLoading}
          />
      }

      {
        attemptState === 'finished' &&
        createAttemptData &&
          <QuizResults result={createAttemptData.createAttempt} quiz={quiz} />
      }

      {
        showNotLoggedInError &&
          <ErrorModal
            message="You need to log in first."
            onClose={() => setShowNotLoggedInError(false)}  
          />
      }

      {
        createAttemptError &&
          <ErrorModal message={createAttemptError.message} />
      }
    </>
  )
}

export default QuizDetails