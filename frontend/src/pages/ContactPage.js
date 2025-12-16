import React, { useState } from 'react';
import axios from 'axios';

function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      const res = await axios.post('http://localhost:5000/api/contact', form);
      setStatus(res.data.message || 'Message sent!');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      setStatus('Something went wrong. Please try again later.');
    }
  };

  return (
    <section className="contact">
      <h2>Contact the Store</h2>

      <p className="contact-info">
        <strong>Address:</strong> Suohou's Timber Mill, [Box Cutting, TCP Gate, Kohima, Nagaland]<br />
        <strong>Phone:</strong> <a href="tel:+911234567890">+91 9856309485</a><br />
        <strong>WhatsApp:</strong>{' '}
        <a href="https://wa.me/919856309485" target="_blank" rel="noreferrer">
          Chat on WhatsApp
        </a>
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Your Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Your Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          placeholder="Your message / requirements"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button type="submit" className="btn">
          Send Message
        </button>
      </form>

      {status && <p className="contact-status">{status}</p>}
    </section>
  );
}

export default ContactPage;
