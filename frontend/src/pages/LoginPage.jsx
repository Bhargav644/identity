import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

/**
 * Login Page Component
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    const result = await login(formData);

    if (result.success) {
      navigate('/profile');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="page-container">
      <Card title="Login">
        {error && <Alert message={error} type="error" onClose={clearError} />}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            error={formErrors.email}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            error={formErrors.password}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <button className="link-button" onClick={handleRegisterClick}>
              Register here
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
