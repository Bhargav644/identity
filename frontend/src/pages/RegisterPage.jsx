import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

/**
 * Register Page Component
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.name) {
      errors.name = 'Name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate('/profile');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="page-container">
      <Card title="Register">
        {error && <Alert message={error} type="error" onClose={clearError} />}

        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            error={formErrors.name}
          />

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

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            error={formErrors.confirmPassword}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <button className="link-button" onClick={handleLoginClick}>
              Login here
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
