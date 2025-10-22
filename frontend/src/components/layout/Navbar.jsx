import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

/**
 * Navigation Bar Component
 */
export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">Identity App</h1>
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">Welcome, {user?.name}</span>
              <Button onClick={handleLogout} variant="secondary">
                Logout
              </Button>
            </>
          ) : (
            <span className="navbar-user">Not logged in</span>
          )}
        </div>
      </div>
    </nav>
  );
}
