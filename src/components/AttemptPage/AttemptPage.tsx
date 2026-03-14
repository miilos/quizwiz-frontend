import { Link, useParams } from "react-router"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { Spinner } from "react-bootstrap"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import QuizResults from "../QuizResults/QuizResults"
import Tag from "../Tag/Tag"
import type { QuizAttempt, QuizDetails, Tag as TagType } from "../../types"

const GET_ATTEMPT = gql`
  query GetAttempt($id: Int!) {
    attempt(id: $id) {
      id
      quiz {
        id
        title
        description
        furtherReading
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
    }
  }
`

interface GetAttemptResponse {
  attempt: Omit<QuizAttempt, 'quiz'> & { quiz: QuizDetails }
}

function AttemptPage() {
  const { id } = useParams()

  const { data, loading } = useQuery<GetAttemptResponse>(GET_ATTEMPT, {
    variables: { id: parseInt(id!) }
  })

  if (loading)
    return <Spinner animation="border" role="status" className="loader loader--primary" />
  
  if (!data)
    return null

  const { attempt } = data
  const { quiz } = attempt

  return (
    <div className="layout-container">
      <div className="quiz quiz-details">
        <div className="quiz__main-info">
          <h3 className="quiz__main-info__title">{quiz.title}</h3>
          <p className="quiz__main-info__author">
            by: <Link to="/" className="quiz__main-info__author__link">{quiz.author.username}</Link>
          </p>
          {quiz.description && (
            <p className="quiz__main-info__description">{quiz.description}</p>
          )}
        </div>
        <div className="quiz__secondary-info">
          <p className="quiz__secondary-info__num-questions">
            <BsFillPatchQuestionFill className="quiz__secondary-info__num-questions__icon" />
            {quiz.questions.length}
          </p>
          {quiz.tags && (
            <div className="quiz__secondary-info__tags-container">
              {quiz.tags.map((tag: TagType) => <Tag tag={tag} key={tag.id} />)}
            </div>
          )}
        </div>
      </div>

      <QuizResults
        result={attempt as unknown as QuizAttempt}
        quiz={quiz}
        showBackButton={false}
      />

      {quiz.furtherReading && (
        <div className="create-quiz__further-reading">
          <h2 className="create-quiz__further-reading__title">Further reading</h2>
          <hr className="create-quiz__further-reading__divider" />
          <p className="create-quiz__further-reading__textarea create-quiz__further-reading__textarea--readonly">
            {quiz.furtherReading}
          </p>
        </div>
      )}
    </div>
  )
}

export default AttemptPage
