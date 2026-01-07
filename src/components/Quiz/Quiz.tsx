import { Link, useNavigate } from "react-router"
import type { Quiz as QuizType, Tag as TagType } from "../../types"
import Tag from "../Tag/Tag"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import type React from "react"


interface QuizProps {
  quiz: QuizType
}


function Quiz({ quiz }: QuizProps) {
  let navigate = useNavigate()

  const handleQuizClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) {
      return
    }

    navigate('/')
  }

  return (
    <>
      <div className="quiz" onClick={handleQuizClick}>
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
    </>
  )
}

export default Quiz