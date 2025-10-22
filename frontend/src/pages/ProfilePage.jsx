import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';

/**
 * Profile Page Component - Protected Route
 */
export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <Card title="User Profile">
        <div className="profile-content">
          <div className="profile-item">
            <strong>Name:</strong>
            <span>{user?.name}</span>
          </div>

          <div className="profile-item">
            <strong>Email:</strong>
            <span>{user?.email}</span>
          </div>

          <div className="profile-item">
            <strong>User ID:</strong>
            <span>{user?.id}</span>
          </div>

          <div className="profile-item">
            <strong>Account Created:</strong>
            <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
