import { useState } from "react"
import type React from "react"
import { useNavigate } from "react-router"
import { gql } from "@apollo/client"
import { useQuery, useMutation } from "@apollo/client/react"
import { Spinner } from "react-bootstrap"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import { FiEdit2, FiTrash2, FiPrinter } from "react-icons/fi"
import { BACKEND_BASE_URI } from "../../config"
import Tag from "../Tag/Tag"
import ErrorModal from "../ErrorModal/ErrorModal"
import type { QuizOverview, Tag as TagType } from "../../types"

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

const DELETE_QUIZ = gql`
  mutation DeleteQuiz($id: Int!) {
    deleteQuiz(id: $id)
  }
`

function AdminQuizzes() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const [deletedIds, setDeletedIds] = useState<number[]>([])

  const { data, loading } = useQuery<{ quizzes: QuizOverview[] }>(GET_ALL_QUIZZES)
  const quizzes = (data?.quizzes ?? []).filter(q => !deletedIds.includes(q.id))

  const [deleteQuizMutation] = useMutation<{ deleteQuiz: boolean }>(DELETE_QUIZ, {
    context: {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }
  })

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    navigate(`/quizzes/${id}/edit`)
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    const { data } = await deleteQuizMutation({ variables: { id } })
    if (!data?.deleteQuiz) {
      setErrorMessage('Error deleting quiz')
      return
    }
    setDeletedIds(prev => [...prev, id])
  }

  const handlePrint = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')
    const res = await fetch(`${BACKEND_BASE_URI}/api/quiz/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      setErrorMessage('Error generating PDF')
      return
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quiz-${id}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <Spinner animation="border" role="status" className="loader loader--primary" />

  return (
    <div className="admin-quizzes">
      <div className="admin-quizzes__header">
        <h2 className="admin-quizzes__title">Quizzes</h2>
      </div>

      {quizzes.length === 0 && (
        <p className="admin-quizzes__empty">No quizzes yet.</p>
      )}

      <div className="admin-quizzes__list">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz admin-quizzes__quiz">
            <div className="quiz__main-info">
              <h3 className="quiz__main-info__title">{quiz.title}</h3>
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
            <div className="quiz-actions" onClick={(e) => e.stopPropagation()}>
              <FiEdit2 className="quiz-actions__icon" onClick={(e) => handleEdit(e, quiz.id)} />
              <FiTrash2 className="quiz-actions__icon" onClick={(e) => handleDelete(e, quiz.id)} />
              <FiPrinter className="quiz-actions__icon" onClick={(e) => handlePrint(e, quiz.id)} />
            </div>
          </div>
        ))}
      </div>

      {errorMessage && <ErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />}
    </div>
  )
}

export default AdminQuizzes
