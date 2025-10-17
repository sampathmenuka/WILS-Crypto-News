import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    // Demo only – replace with your backend or email service
    setTimeout(() => {
      setStatus("Thanks! We'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
    }, 800);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Contact Us</h1>
        <span className="muted">We usually reply within 1-2 business days.</span>
      </div>

      <section className="contact-layout">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="muted">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="muted">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="message" className="muted">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="How can we help?"
            />
          </div>
          <button className="btn" type="submit">
            Send Message
          </button>
          {status && <div className="muted" style={{ marginTop: '0.5rem' }}>{status}</div>}
        </form>

        <div className="card">
          <div className="card-body">
            <h3>Our Location</h3>
            <div className="map-placeholder">Map Placeholder</div>
            <div style={{ marginTop: '0.6rem' }} className="muted">
              123 Crypto Ave, Web3 City
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
