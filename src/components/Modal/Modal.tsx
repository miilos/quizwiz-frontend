import { useEffect } from "react"
import type React from "react"
import { IoMdClose } from "react-icons/io"

interface ModalProps {
  title: string
  children: React.ReactNode
  onClose: () => void
}

function Modal({ title, children, onClose }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEsc)

    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div className="app-modal" onClick={(e) => e.stopPropagation()}>
        <div className="app-modal__header">
          <h2 className="app-modal__header__title">{title}</h2>
          <button className="app-modal__header__close" onClick={onClose}>
            <IoMdClose />
          </button>
        </div>
        <div className="app-modal__content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
