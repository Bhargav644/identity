/**
 * Reusable Button Component
 */
export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full-width' : ''}`}
    >
      {children}
    </button>
  );
}
