interface StartQuizButtonProps {
  onClick: () => void
}

function StartQuizButton({ onClick }: StartQuizButtonProps) {
  return (
    <>
      <div className="start-quiz-container">
        <button className="start-quiz-btn" onClick={onClick}>
          Start quiz!
        </button>
      </div>
    </>
  )
}

export default StartQuizButton