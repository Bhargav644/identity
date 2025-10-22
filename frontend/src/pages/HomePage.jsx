import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

/**
 * Home Page Component
 */
export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-container">
      <Card title="Welcome to Identity App">
        <div className="home-content">
          <p className="home-description">
            A secure session-based authentication system built with Node.js,
            Express, PostgreSQL, and React.
          </p>

          {isAuthenticated ? (
            <>
              <p>You are logged in!</p>
              <Button onClick={() => navigate('/profile')} fullWidth>
                View Profile
              </Button>
            </>
          ) : (
            <div className="home-actions">
              <Button onClick={() => navigate('/login')} fullWidth>
                Login
              </Button>
              <Button
                onClick={() => navigate('/register')}
                variant="secondary"
                fullWidth
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
