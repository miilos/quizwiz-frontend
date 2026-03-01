import type React from "react"

interface FormErrorProps {
  children: React.ReactNode
}

function FormError ({ children }: FormErrorProps) {
  return (
    <>
      <div className="form-error">
        { children }
      </div>
    </>
  )
}

export default FormError