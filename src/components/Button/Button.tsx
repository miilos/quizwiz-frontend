type ButtonProps = {
  variant: string
  children: React.ReactNode
  extraClasses?: string
}

function Button({ variant, children, extraClasses = '' }: ButtonProps) {
  return (
    <>
      <button className={`btn btn--${variant} ${extraClasses}`}>
        {children}
      </button>
    </>
  )
}

export default Button