import { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import Navbar from "../../components/Navbar";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({email: '', password: ''});
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData(
      prev => ({
        ...prev, [e.target.name]:e.target.value
      })
    );
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    try{
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
      const {token, user} = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    }catch(error){
      const msg = error.response?.data?.message || 'Login Failed';
      setError(msg);
    }

  }

  return (
    <div className="login-body">
      <Navbar />

      <div className="login-container">
        <h1>Login</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name='email' type="email" placeholder="Email" required value={formData.email} onChange={handleChange}/><br /><br />
          <input name='password' type="password" placeholder="Password" required value={formData.password} onChange={handleChange}/><br /><br />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to='/register'>Register Here</Link></p>
      </div>
    </div>
  );
}

export default Login;
