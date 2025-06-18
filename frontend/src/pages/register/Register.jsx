import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import './Register.css'
import Navbar from '../../components/Navbar';


const Register = () => {

    const [formData, setFormData] = useState({name:'', email:'', password:'', password_confirmation: ''});
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = e => {
        setFormData(prev => ({
            ...prev, [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
            console.log('Registration Successful: ', response.data);
            alert('Registration Successful, You can now Login!');
            navigate('/login');
        }catch(error){
            const msg = error.response?.data?.message || 'Registration Failed';
            setError(msg);
        }
    }


    return (
        <div className="register-body">
            <Navbar />

            <div className="register-container">
                <h1>Register</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input name="name" type="text" placeholder="Full Name" required value={formData.name} onChange={handleChange}/><br /><br />
                    <input name="email" type="email" placeholder="Email" required value={formData.email} onChange={handleChange}/><br /><br />
                    <input name="password" type="password" placeholder="Password" required value={formData.password} onChange={handleChange}/><br /><br />
                    <input name="password_confirmation" type="password" placeholder="Confirm Password" required value={formData.password_confirmation} onChange={handleChange}/><br /><br />
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <Link to='/login'>Login Here</Link></p>
            </div>
        </div>
    );
};

export default Register;
