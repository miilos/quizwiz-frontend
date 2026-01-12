import { useRef, useState } from "react"
import type { QuizDetails } from "../../types"
import Button from "../Button/Button"
import Question from "../Question/Question"

interface QuizAttemptProps {
  quiz: QuizDetails
}

interface Answer {
  questionId: number;
  answer: number[];
}

interface AttemptRef {
  quizId: number;
  userId: number;
  answers: Answer[];
  attemptedAt: string|null;
}

function QuizAttempt({ quiz }: QuizAttemptProps) {
  const [showFinishQuizBtn, setShowFinishQuizBtn] = useState(false)
  const attempt = useRef<AttemptRef>({
    quizId: quiz.id,
    userId: 1,
    answers: [],
    attemptedAt: null
  })

  const updateAttemptData = (questionId: number, answer: number[]) => {
    const answerIndex = attempt.current.answers.findIndex(
      answer => answer.questionId === questionId
    )

    if (answerIndex !== -1) {
      attempt.current.answers[answerIndex].answer = answer
    }
    else {
      attempt.current.answers.push({
        questionId,
        answer
      })
    }
  }

  const isQuizFilledOut = () => {
    let isFilledOut = true

    quiz.questions.forEach(question => {
      const questionAnswer = attempt.current.answers.find(
        answer => answer.questionId === question.id
      )

      if (!questionAnswer) {
        isFilledOut = false
        return
      }

      if (questionAnswer.answer.length !== question.correctAnswer.length) {
        isFilledOut = false
      }
    })

    return isFilledOut
  }

  const handleAnswerSelection = (questionId: number, answer: number[]) => {
    updateAttemptData(questionId, answer)
    
    setShowFinishQuizBtn(
      isQuizFilledOut()
    )
  }

  const handleQuestionCompletion = (questionId: number) => {
    const question = quiz.questions.find(q => q.id === questionId)

    if (!question) {
      return
    }

    const nextQuestion = quiz.questions.find(q => q.position === question.position + 1)
    
    if (nextQuestion) {
      const nextQuestionEl = document.querySelector(`.question-${nextQuestion.position}`)
      setTimeout(() => {
        nextQuestionEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 700)
    }
  }

  const handleEndQuizClick = () => {
    attempt.current.attemptedAt = new Date().toISOString()
    console.log(attempt.current)
  }

  return (
    <>
      <div className="quiz-attempt">
        {
          quiz.questions.map(
            question =>
            <Question
              question={question}
              onAnswerSelect={handleAnswerSelection}
              onQuestionComplete={handleQuestionCompletion}
              key={question.id}
            />
          )
        }
      </div>

      {
        showFinishQuizBtn &&
        <Button variant='primary' extraClasses='end-quiz-btn' onClick={handleEndQuizClick}>
          Finish quiz
        </Button>
      }
    </>
  )
}

export default QuizAttempt