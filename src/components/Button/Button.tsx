type ButtonProps = {
  variant: string;
  children: React.ReactNode;
  extraClasses?: string;
  onClick?: () => void;
}

function Button({ variant, children, extraClasses = '', onClick }: ButtonProps) {
  return (
    <>
      <button className={`btn btn--${variant} ${extraClasses}`} onClick={onClick}>
        {children}
      </button>
    </>
  )
}

export default Button