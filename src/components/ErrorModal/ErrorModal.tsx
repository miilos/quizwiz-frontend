import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdError } from "react-icons/md";

interface ErrorModalProps {
  message: string;
  onClose?: () => void;
}

function ErrorModal({ message, onClose }: ErrorModalProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    
    if (onClose) {
      onClose()
    }
  }

  useEffect(() => {
    const handleEscPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    document.addEventListener('keydown', handleEscPress)

    return
      () => document.removeEventListener('keydown', handleEscPress)
  }, [])

  if (!isVisible) return null

  return (
    <>
      <div
        className="error"
        onClick={() => handleClose()}
      >
        <div className="error__left">
          <MdError className="error__left__icon" />
        </div>
        <div className="error__right">
          <p className="error__right__message">
            { message }
          </p>
        </div>

        <IoMdClose
          className="error__close"
          onClick={() => handleClose()}
        />
      </div>
    </>
  )
}

export default ErrorModal