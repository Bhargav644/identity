/**
 * Reusable Card Component
 */
export function Card({ children, title }) {
  return (
    <div className="card">
      {title && <h2 className="card-title">{title}</h2>}
      <div className="card-content">{children}</div>
    </div>
  );
}
