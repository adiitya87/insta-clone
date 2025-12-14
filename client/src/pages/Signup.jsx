import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/signup', formData);
      
      // Save user to context and local storage
      login({ username: data.username, email: data.email }, data.token);
      
      toast.success('Account created successfully!');
      navigate('/'); // Redirect to Home Feed
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Signup failed';
      toast.error(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Instagram Clone</h1>
        <p style={styles.subtitle}>Sign up to see photos from your friends.</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            Sign up
          </button>
        </form>

        <div style={styles.footer}>
          <p>Have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

// Inline styles for quick layout (You can move these to CSS file if preferred)
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' },
  card: { backgroundColor: 'white', border: '1px solid #dbdbdb', padding: '40px', width: '350px', textAlign: 'center' },
  logo: { fontFamily: 'cursive', fontSize: '2rem', margin: '0 0 10px 0' },
  subtitle: { color: '#8e8e8e', fontWeight: 'bold', marginBottom: '20px' },
  footer: { marginTop: '20px', fontSize: '14px' }
};

export default Signup;