import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { useParams } from "react-router"
import { Spinner } from "react-bootstrap"
import Quiz from "../Quiz/Quiz"
import type { QuizOverview } from "../../types"

const FILTER_BY_TAGS = gql`
  query FilterByTags($tagIds: [Int!]) {
    filterByTags(tagIds: $tagIds) {
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

interface FilterByTagsResult {
  filterByTags: QuizOverview[]
}

function TagQuizList() {
  const { id } = useParams()
  const tagId = parseInt(id!)

  const { loading, error, data } = useQuery<FilterByTagsResult>(FILTER_BY_TAGS, {
    variables: { tagIds: [tagId] }
  })

  if (loading) return <Spinner animation="border" role="status" className="loader loader--primary" />
  if (error) return <div className="error" />

  const quizzes = data?.filterByTags ?? []
  const tag = quizzes.flatMap(q => q.tags ?? []).find(t => Number(t.id) === tagId)

  return (
    <div className="quiz-list-container">
      <h1 className="quiz-list__title">Quizzes with tag '{tag?.displayName ?? tag?.name ?? id}'</h1>

      <div className="quiz-list__quizzes">
        {quizzes.map(quiz => <Quiz quiz={quiz} key={quiz.id} />)}
      </div>
    </div>
  )
}

export default TagQuizList
