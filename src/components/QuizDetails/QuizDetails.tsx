import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { Spinner } from "react-bootstrap"
import { Link, useParams } from "react-router"
import type { QuizDetails as QuizDetailsType, Tag as TagType } from "../../types"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import Tag from "../Tag/Tag"
import { useState } from "react"
import StartQuizButton from "../StartQuizButton/StartQuizButton"
import QuizAttempt from "../QuizAttempt/QuizAttempt"

interface GetQuizResult {
  quiz: QuizDetailsType;
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

function QuizDetails() {
  let { id } = useParams()
  const [attemptState, setAttemptState] = useState<QuizAttemptState>('notStarted')

  const handleStartBtnClick = () => {
    setAttemptState('started')
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
    return <div className="error"></div>
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
        attemptState === 'started' && <QuizAttempt quiz={quiz} />
      }
    </>
  )
}

export default QuizDetails