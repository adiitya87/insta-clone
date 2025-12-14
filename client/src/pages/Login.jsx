import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
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
      const { data } = await API.post('/users/login', formData);
      
      // Update global auth state
      login({ username: data.username, email: data.email }, data.token);
      
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      toast.error(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Instagram Clone</h1>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
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
            Log in
          </button>
        </form>

        <div style={styles.footer}>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' },
  card: { backgroundColor: 'white', border: '1px solid #dbdbdb', padding: '40px', width: '350px', textAlign: 'center' },
  
  // --- UPDATED FONT STYLE HERE ---
  logo: { 
    fontFamily: "'Grand Hotel', cursive", 
    fontSize: '3rem', // Increased size because this font is naturally smaller
    margin: '0',
    color: '#262626'
  },
  
  footer: { marginTop: '20px', fontSize: '14px' }
};

export default Login;