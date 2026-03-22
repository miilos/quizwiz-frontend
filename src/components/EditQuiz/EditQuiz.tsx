import { useEffect, useRef, useState } from "react"
import type React from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { useNavigate, useParams } from "react-router"
import { BsPlusLg, BsStars } from "react-icons/bs"
import { IoMdClose } from "react-icons/io"
import { Spinner } from "react-bootstrap"
import Button from "../Button/Button"
import ErrorModal from "../ErrorModal/ErrorModal"
import FormError from "../FormError/FormError"
import Modal from "../Modal/Modal"
import CreateQuizQuestion, { type QuestionDraft } from "../CreateQuiz/CreateQuizQuestion"
import { gql } from "@apollo/client"
import { BACKEND_BASE_URI } from "../../config"

const GET_QUIZ = gql`
  query GetQuizForEdit($id: Int!) {
    quiz(id: $id) {
      id
      title
      description
      furtherReading
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
        explanation
      }
    }
  }
`

const UPDATE_QUIZ = gql`
  mutation UpdateQuiz($id: Int!, $quiz: UpdateQuizInput!) {
    updateQuiz(id: $id, quiz: $quiz)
  }
`

interface TagDraft {
  id: number
  name: string
  editing: boolean
}

interface GetQuizResult {
  quiz: {
    id: number
    title: string
    description: string | null
    furtherReading: string | null
    tags: [
      {
        id: number;
        name: string;
        displayName: string
      }
    ]
    questions: [
      {
        id: number
        text: string
        options: string[]
        correctAnswer: number | number[]
        type: 'one' | 'multiple'
        explanation: string | null
      }
    ]
  }
}

function EditQuiz() {
  const { id } = useParams()
  const quizId = parseInt(id!)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [furtherReading, setFurtherReading] = useState('')
  const [tags, setTags] = useState<TagDraft[]>([])
  const [questions, setQuestions] = useState<QuestionDraft[]>([])
  const [initialized, setInitialized] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [generatePrompt, setGeneratePrompt] = useState('')
  const [generateLoading, setGenerateLoading] = useState(false)
  const [generateError, setGenerateError] = useState('')

  // existing questions use their backend ids.
  // new questions added during editing use negative ids to avoid collisions.
  const newQuestionCounter = useRef(0)
  const nextNewId = () => --newQuestionCounter.current

  const tagIdCounter = useRef(0)
  const nextTagId = () => ++tagIdCounter.current

  const navigate = useNavigate()

  const { loading: queryLoading, error: queryError, data } = useQuery<GetQuizResult>(GET_QUIZ, {
    variables: { id: quizId }
  })

  useEffect(() => {
    if (data?.quiz && !initialized) {
      const quiz = data.quiz
      setTitle(quiz.title)
      setDescription(quiz.description ?? '')
      setFurtherReading(quiz.furtherReading ?? '')
      setTags(
        (quiz.tags ?? []).map((t: any) => ({
          id: nextTagId(),
          name: t.name,
          editing: false
        }))
      )
      setQuestions(
        quiz.questions.map((q: any) => ({
          id: q.id,
          text: q.text,
          options: q.options,
          correctAnswers: Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer],
          type: q.type as 'one' | 'multiple',
          explanation: q.explanation ?? ''
        }))
      )
      setInitialized(true)
    }
  }, [data, initialized])

  const [updateQuizMutation, { loading }] = useMutation<{ updateQuiz: boolean }>(
    UPDATE_QUIZ,
    {
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    }
  )

  const handleAddTag = () => {
    setTags(prev => [...prev, { id: nextTagId(), name: '', editing: true }])
  }

  const handleTagChange = (id: number, value: string) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, name: value } : t))
  }

  const handleTagBlur = (id: number) => {
    setTags(prev => {
      const tag = prev.find(t => t.id === id)
      if (!tag) return prev
      if (!tag.name.trim()) return prev.filter(t => t.id !== id)
      return prev.map(t => t.id === id ? { ...t, editing: false } : t)
    })
  }

  const handleTagKeyDown = (id: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
  }

  const handleRemoveTag = (id: number) => {
    setTags(prev => prev.filter(t => t.id !== id))
  }

  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, {
      id: nextNewId(),
      text: '',
      options: ['', '', '', ''],
      correctAnswers: [],
      type: 'one',
      explanation: ''
    }])
  }

  const updateQuestion = (id: number, updates: Partial<QuestionDraft>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const removeQuestion = (id: number) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const handleGenerateQuestion = async () => {
    setGenerateLoading(true)
    setGenerateError('')

    const res = await fetch(
      BACKEND_BASE_URI + '/api/prompt/questions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt: generatePrompt })
      }
    )

    const json = await res.json()
    setGenerateLoading(false)

    if (!res.ok) {
      setGenerateError(json.message)
      return
    }

    const { question } = json.data

    setQuestions(prev => [...prev, {
      id: nextNewId(),
      text: question.question,
      options: question.answers,
      correctAnswers: [question.correctAnswer],
      type: 'one',
      explanation: question.explanation ?? ''
    }])

    setIsGenerateModalOpen(false)
    setGeneratePrompt('')
    setGenerateError('')
  }

  const handleUpdateQuiz = async () => {
    try {
      await updateQuizMutation({
        refetchQueries: ['GetQuiz', 'GetQuizForEdit'],
        variables: {
          id: quizId,
          quiz: {
            title,
            description,
            furtherReading,
            tags: tags.filter(t => t.name.trim()).map(({ name }) => ({ name })),
            questions: questions.map((q) => ({
              id: q.id,
              text: q.text,
              options: q.options,
              correctAnswer: q.type === 'one' ? (q.correctAnswers[0] ?? 0) : q.correctAnswers,
              type: q.type,
              ...(q.explanation ? { explanation: q.explanation } : {})
            }))
          }
        }
      })

      navigate('/profile?tab=quizzes')
    } catch (err: any) {
      setErrorMessage(err.message ?? 'An unexpected error occurred.')
    }
  }

  if (queryLoading) {
    return <Spinner animation="border" role="status" className="loader loader--primary" />
  }

  if (queryError) {
    return <ErrorModal message={queryError.message} />
  }

  return (
    <div className="create-quiz">
      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={() => setErrorMessage('')} />
      )}

      {isGenerateModalOpen && (
        <Modal
          title="Generate question with AI"
          onClose={() => setIsGenerateModalOpen(false)}
        >
          <div className="generate-modal">
            <p className="generate-modal__description">
              Just describe what you want the question to be about and our AI takes care of the rest, or be as specific as you want!
            </p>
            <textarea
              className="generate-modal__textarea"
              placeholder="Describe the question..."
              value={generatePrompt}
              onChange={(e) => setGeneratePrompt(e.target.value)}
            />
            {generateError && <FormError>{generateError}</FormError>}
            <Button
              variant="secondary"
              extraClasses="generate-modal__submit-btn"
              onClick={handleGenerateQuestion}
            >
              {generateLoading && (
                <Spinner animation="border" role="status" className="loader form__loader loader--primary" />
              )}
              Generate
            </Button>
          </div>
        </Modal>
      )}

      <div className="create-quiz__header">
        <div className="create-quiz__header__main-info">
          <input
            type="text"
            className="create-quiz__header__title"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="create-quiz__header__description"
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="create-quiz__header__secondary-info">
          <button className="create-quiz__header__add-tag-btn" onClick={handleAddTag}>
            <BsPlusLg />
            Add tag
          </button>

          {tags.map(tag =>
            tag.editing ? (
              <div className="tag" key={tag.id}>
                <input
                  type="text"
                  className="create-quiz__header__tag-input"
                  value={tag.name}
                  onChange={(e) => handleTagChange(tag.id, e.target.value)}
                  onBlur={() => handleTagBlur(tag.id)}
                  onKeyDown={(e) => handleTagKeyDown(tag.id, e)}
                  autoFocus
                />
              </div>
            ) : (
              <div className="tag create-quiz__header__tag" key={tag.id}>
                <span className="tag__name">{tag.name}</span>
                <button
                  className="create-quiz__header__tag__remove"
                  onClick={() => handleRemoveTag(tag.id)}
                >
                  <IoMdClose />
                </button>
              </div>
            )
          )}
        </div>
      </div>

      <div className="create-quiz__questions">
        {questions.map((question, idx) => (
          <CreateQuizQuestion
            key={question.id}
            question={question}
            questionNumber={idx + 1}
            onUpdate={(updates) => updateQuestion(question.id, updates)}
            onRemove={() => removeQuestion(question.id)}
          />
        ))}

        <button className="create-quiz__questions__add-btn" onClick={handleAddQuestion}>
          <BsPlusLg className="create-quiz__questions__add-btn__icon" />
          Add question
        </button>

        <button className="create-quiz__questions__generate-btn" onClick={() => setIsGenerateModalOpen(true)}>
          <BsStars className="create-quiz__questions__generate-btn__icon" />
          Generate with AI
        </button>
      </div>

      <div className="create-quiz__further-reading">
        <h2 className="create-quiz__further-reading__title">Further reading</h2>
        <hr className="create-quiz__further-reading__divider" />
        <p className="create-quiz__further-reading__description">
          Add an explanation of this quiz or its questions so the users understand and learn better. You can also add links for further reading so everybody can get the most out of your quiz :)
        </p>
        <textarea
          className="create-quiz__further-reading__textarea"
          placeholder="Enter further reading..."
          value={furtherReading}
          onChange={(e) => setFurtherReading(e.target.value)}
        />
      </div>

      <Button
        variant="primary"
        extraClasses="create-quiz__submit-btn"
        onClick={handleUpdateQuiz}
      >
        {loading && (
          <Spinner animation="border" role="status" className="loader create-quiz__submit-loader" />
        )}
        Save changes
      </Button>
    </div>
  )
}

export default EditQuiz
