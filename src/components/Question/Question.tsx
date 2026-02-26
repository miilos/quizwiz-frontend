import { useState } from "react"
import type { Question as QuestionType } from "../../types"
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { MdQuiz } from "react-icons/md";

interface QuestionProps {
  question: QuestionType;
  onAnswerSelect: (questionId: number, answer: number[]) => void;
  onQuestionComplete: (questionId: number) => void;
}

function Question({ question, onAnswerSelect, onQuestionComplete }: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number[]>([])

  const handleAnswerSelect = (option: number) => {
    let newSelectedAnswer = selectedAnswer

    if (question.type === 'one') {
      if (option === selectedAnswer[0]) {
        newSelectedAnswer = []
      }
      else {
        newSelectedAnswer = [option]
      }
    }
    else {
      if (selectedAnswer.includes(option)) {
        newSelectedAnswer = selectedAnswer.filter(answer => answer !== option)
      }
      else {
        newSelectedAnswer = [...selectedAnswer, option]
      }
    }

    setSelectedAnswer(newSelectedAnswer)
    onAnswerSelect(question.id, newSelectedAnswer)
    
    if (newSelectedAnswer.length === question.correctAnswer.length) {
      onQuestionComplete(question.id)
    }
  }

  return (
    <>
      <div className={`question question-${question.position}`}>
        <div className="question__header">
          <p className="question__header__number">
            {question.position}.
          </p>
          { question.type === 'one' && <BsFillQuestionSquareFill className="question__header__icon" /> }
          { question.type === 'multiple' && <MdQuiz className="question__header__icon" /> }
        </div>
        <h3 className="question__text">
          { question.text }
        </h3>
        <div className="question__answers">
          {
            question.options.map((option, i) =>
              <div
                className={
                  selectedAnswer.includes(i) ?
                    "question__answers__option question__answers__option--selected" :
                    "question__answers__option"
                  }
                key={i}
                onClick={() => handleAnswerSelect(i)}
              >
                {option}
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}

export default Question