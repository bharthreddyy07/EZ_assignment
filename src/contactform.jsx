import React, { useState } from 'react';
import './ContactForm.css';

const API_URL = 'https://vernanbackend.ezlab.in/api/contact-us/';

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [error, setError] = useState('');
  const [submitStatus, setSubmitStatus] = useState(''); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSubmitStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { name, email, phone, message } = formData;
    if (!name || !email || !phone || !message) {
      setError('All fields must be filled out to submit the form.');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubmitStatus('submitting');
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' }); 
      } else {
        setSubmitStatus('error');
        setError('Submission failed. Server returned an error.');
      }
    } catch (apiError) {
      setSubmitStatus('error');
      setError('Network error: Could not connect to the server.');
      console.error(apiError);
    }
  };

  return (
    <div className="contact-container">
      <h2 className="form-title">Contact Us Form</h2>
      

      {submitStatus === 'success' && (
        <p className="status-message success"> Form Submitted</p>
      )}

      {error && <p className="status-message error">{error}</p>}
      
      <form className="contact-form" onSubmit={handleSubmit}>
        
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Your Name" 
          disabled={submitStatus === 'submitting'}
        />

        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Your Email (Required)" 
          disabled={submitStatus === 'submitting'}
        />

        <input 
          type="tel" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          placeholder="Your Phone" 
          disabled={submitStatus === 'submitting'}
        />

  
        <textarea 
          name="message" 
          rows="4" 
          value={formData.message} 
          onChange={handleChange} 
          placeholder="Your Message"
          disabled={submitStatus === 'submitting'}
        ></textarea>

        <button type="submit" disabled={submitStatus === 'submitting'}>
          {submitStatus === 'submitting' ? 'Sending...' : 'Submit Form'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;