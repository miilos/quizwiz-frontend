import { useState } from "react"
import type React from "react"
import { useNavigate } from "react-router"
import { useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import { FiEdit2, FiTrash2, FiPrinter } from "react-icons/fi"
import type { ProfileQuiz } from "../../types"
import ErrorModal from "../ErrorModal/ErrorModal"
import { BACKEND_BASE_URI } from "../../config"

const DELETE_QUIZ = gql`
  mutation DeleteQuiz($id: Int!) {
    deleteQuiz(id: $id)
  }
`

interface MyQuizzesProps {
  quizzes: ProfileQuiz[]
}

function MyQuizzes({ quizzes: initialQuizzes }: MyQuizzesProps) {
  const [quizzes, setQuizzes] = useState(initialQuizzes)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const navigate = useNavigate()

  const [deleteQuizMutation] = useMutation<{ deleteQuiz: boolean }>(DELETE_QUIZ, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
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
    setQuizzes(prev => prev.filter(q => q.id !== id))
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

  if (quizzes.length === 0) {
    return <p className="my-quizzes__empty">You haven't created any quizzes yet.</p>
  }

  return (
    <div className="my-quizzes">
      <h2 className="my-quizzes__title">My quizzes</h2>
      <div className="my-quizzes__list">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="quiz my-quizzes__quiz"
            onClick={() => navigate(`/quizzes/${quiz.id}`)}
          >
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
            </div>
            <div className="quiz-actions" onClick={(e) => e.stopPropagation()}>
              <FiEdit2 className="quiz-actions__icon" onClick={(e) => handleEdit(e, quiz.id)} />
              <FiTrash2 className="quiz-actions__icon" onClick={(e) => handleDelete(e, quiz.id)} />
              <FiPrinter className="quiz-actions__icon" onClick={(e) => handlePrint(e, quiz.id)} />
            </div>
          </div>
        ))}
      </div>
      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
    </div>
  )
}

export default MyQuizzes
