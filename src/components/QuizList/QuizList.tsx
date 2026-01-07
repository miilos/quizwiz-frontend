import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Spinner } from "react-bootstrap";
import Quiz from "../Quiz/Quiz";
import type { Quiz as QuizType } from "../../types";

interface QuizResult {
  quizzes: [QuizType]
}

const GET_ALL_QUIZZES = gql`
  query GetAllQuizzes {
    quizzes {
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
      }
      author {
        id
        username
      }
    }
  }
`

function QuizList() {
  const { loading, error, data } = useQuery<QuizResult>(GET_ALL_QUIZZES)

  if (loading) {
    return (
      <Spinner animation="border" role="status" className="loader loader--primary" />
    )
  }

  if (error) {
    return (
      <div className="error"></div>
    )
  }

  return (
    <>
      <div className="quiz-list-container">
        <h1 className="quiz-list__title">Browse quizzes</h1>

        <div className="quiz-list__quizzes">
          { data?.quizzes.map(
            quiz => <Quiz quiz={quiz} key={quiz.id} />
          ) }
        </div>
      </div>
    </>
  )
}

export default QuizList;