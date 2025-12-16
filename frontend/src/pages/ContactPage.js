import React, { useState } from "react";
import axios from "axios";

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setIsError(false);

    try {
      const res = await axios.post("http://localhost:5000/api/contact", form);
      setStatus(res.data.message || "Message sent successfully!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      setIsError(true);
      setStatus("Something went wrong. Please try again later.");
    }
  };

  return (
    <section className="contact">
      {/* PAGE HEADER */}
      <div className="contact-header">
        <h2>Contact the Store</h2>
        <p>
          Have a question or need bulk timber? Get in touch with us and we’ll
          respond quickly.
        </p>
      </div>

      {/* CONTACT DETAILS */}
      <div className="contact-cards">
        <div className="contact-card">
          📍
          <h4>Address</h4>
          <p>
            Suohou's Timber Mill <br />
            Box Cutting, TCP Gate <br />
            Kohima, Nagaland
          </p>
        </div>

        <div className="contact-card">
          📞
          <h4>Phone</h4>
          <p>
            <a href="tel:+919856309485">+91 98563 09485</a>
          </p>
        </div>

        <div className="contact-card">
          💬
          <h4>WhatsApp</h4>
          <p>
            <a
              href="https://wa.me/919856309485"
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
          </p>
        </div>
      </div>

      {/* CONTACT FORM */}
      <div className="contact-form-wrapper">
        <h3>Send Us a Message</h3>

        <form className="contact-form modern" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email Address (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <textarea
            placeholder="Your message or requirements"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />

          <button type="submit" className="btn full">
            Send Message
          </button>
        </form>

        {status && (
          <p className={`contact-status ${isError ? "error" : "success"}`}>
            {status}
          </p>
        )}
      </div>
    </section>
  );
}

export default ContactPage;
