import { BsFillQuestionSquareFill, BsPlusLg } from "react-icons/bs"
import { MdQuiz } from "react-icons/md"
import { IoMdClose, IoMdTrash } from "react-icons/io"

export interface QuestionDraft {
  id: number
  text: string
  options: string[]
  correctAnswers: number[]
  type: 'one' | 'multiple'
  explanation: string
}

interface CreateQuizQuestionProps {
  question: QuestionDraft
  questionNumber: number
  onUpdate: (updates: Partial<QuestionDraft>) => void
  onRemove: () => void
}

function CreateQuizQuestion({ question, questionNumber, onUpdate, onRemove }: CreateQuizQuestionProps) {
  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...question.options]
    newOptions[idx] = value
    onUpdate({ options: newOptions })
  }

  const handleRemoveOption = (idx: number) => {
    const newOptions = question.options.filter((_, i) => i !== idx)

    const newCorrectAnswers = question.correctAnswers
      .filter(a => a !== idx)
      .map(a => a > idx ? a - 1 : a)

    onUpdate({ options: newOptions, correctAnswers: newCorrectAnswers })
  }

  const handleCorrectAnswerToggle = (idx: number) => {
    if (question.type === 'one') {
      onUpdate({
        correctAnswers: question.correctAnswers[0] === idx ? [] : [idx]
      })
    }
    else {
      const isSelected = question.correctAnswers.includes(idx)
      onUpdate({
        correctAnswers: isSelected
          ? question.correctAnswers.filter(a => a !== idx)
          : [...question.correctAnswers, idx]
      })
    }
  }

  const handleTypeChange = (type: 'one' | 'multiple') => {
    const updates: Partial<QuestionDraft> = { type }

    if (type === 'one' && question.correctAnswers.length > 1) {
      updates.correctAnswers = [question.correctAnswers[0]]
    }
    
    onUpdate(updates)
  }

  return (
    <div className="create-quiz-question">
      <div className="create-quiz-question__form">
        <div className="create-quiz-question__form__header">
          <div className="create-quiz-question__form__header__number">
            {questionNumber}.
          </div>
        </div>

        <input
          type="text"
          className="create-quiz-question__form__text-input"
          placeholder="Enter question..."
          value={question.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
        />

        <div className="create-quiz-question__form__options">
          {question.options.map((option, idx) => (
            <div className="create-quiz-question__form__option" key={idx}>
              <div className="create-quiz-question__form__option__input-container">
                <input
                  type="text"
                  placeholder={`Answer option ${idx + 1}...`}
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
                <button
                  className="create-quiz-question__form__option__input-container__remove"
                  onClick={() => handleRemoveOption(idx)}
                >
                  <IoMdClose />
                </button>
              </div>
              <input
                type="checkbox"
                className="create-quiz-question__form__option__checkbox"
                checked={question.correctAnswers.includes(idx)}
                onChange={() => handleCorrectAnswerToggle(idx)}
              />
            </div>
          ))}
        </div>

        <button
          className="create-quiz-question__form__add-option-btn"
          onClick={() => onUpdate({ options: [...question.options, ''] })}
        >
          <BsPlusLg />
          Add option
        </button>

        <textarea
          className="create-quiz-question__form__explanation"
          placeholder="Enter explanation... (optional)"
          value={question.explanation}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
        />
      </div>

      <div className="create-quiz-question__type-selector">
        <div className="create-quiz-question__type-selector__icons">
          <button
            className={`create-quiz-question__type-selector__btn${question.type === 'one' ? ' create-quiz-question__type-selector__btn--selected' : ''}`}
            onClick={() => handleTypeChange('one')}
            title="Single answer"
          >
            <BsFillQuestionSquareFill />
          </button>
          <button
            className={`create-quiz-question__type-selector__btn${question.type === 'multiple' ? ' create-quiz-question__type-selector__btn--selected' : ''}`}
            onClick={() => handleTypeChange('multiple')}
            title="Multiple choice"
          >
            <MdQuiz />
          </button>
        </div>
        <button
          className="create-quiz-question__type-selector__remove-btn"
          onClick={onRemove}
          title="Remove question"
        >
          <IoMdTrash />
        </button>
      </div>
    </div>
  )
}

export default CreateQuizQuestion
