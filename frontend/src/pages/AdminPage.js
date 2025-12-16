import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [woods, setWoods] = useState([]);
  const [contacts, setContacts] = useState([]);

  /* ===============================
     ANALYTICS STATE
  ================================ */
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    enquiries: 0,
  });

  const [form, setForm] = useState({
    name: '',
    description: '',
    stock: '',
    price: '',
    image: null,
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    stock: '',
    price: '',
  });

  /* ===============================
     CHECK LOGIN ON LOAD
  ================================ */
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsLoggedIn(true);
      fetchWoods();
      fetchContacts();
    }
  }, []);

  /* ===============================
     UPDATE ANALYTICS
  ================================ */
  useEffect(() => {
    const totalStock = woods.reduce(
      (sum, w) => sum + Number(w.stock || 0),
      0
    );

    const lowStock = woods.filter(
      (w) => Number(w.stock) <= 10
    ).length;

    setAnalytics({
      totalProducts: woods.length,
      totalStock,
      lowStock,
      enquiries: contacts.length,
    });
  }, [woods, contacts]);

  /* ===============================
     AUTH HEADER
  ================================ */
  const authHeader = () => ({
    headers: {
      Authorization: localStorage.getItem('admin_token'),
    },
  });

  /* ===============================
     FETCH DATA
  ================================ */
  const fetchWoods = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/woods');
      setWoods(res.data);
    } catch (err) {
      console.error('Error fetching woods:', err);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/contact',
        authHeader()
      );
      setContacts(res.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  /* ===============================
     LOGIN
  ================================ */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/admin/login',
        loginForm
      );
      localStorage.setItem('admin_token', res.data.token);
      setIsLoggedIn(true);
      fetchWoods();
      fetchContacts();
    } catch {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
  };

  /* ===============================
     UPLOAD STOCK
  ================================ */
  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      value && formData.append(key, value)
    );

    try {
      await axios.post(
        'http://localhost:5000/api/woods',
        formData,
        authHeader()
      );
      setForm({
        name: '',
        description: '',
        stock: '',
        price: '',
        image: null,
      });
      fetchWoods();
    } catch {
      alert('Error uploading item');
    }
  };

  /* ===============================
     DELETE STOCK
  ================================ */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/woods/${id}`,
        authHeader()
      );
      fetchWoods();
    } catch {
      alert('Error deleting item');
    }
  };

  /* ===============================
     EDIT STOCK
  ================================ */
  const startEdit = (wood) => {
    setEditId(wood._id);
    setEditForm({
      name: wood.name,
      description: wood.description,
      stock: wood.stock,
      price: wood.price,
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/woods/${id}`,
        {
          ...editForm,
          stock: Number(editForm.stock),
          price: Number(editForm.price),
        },
        authHeader()
      );
      setEditId(null);
      fetchWoods();
    } catch {
      alert('Error updating item');
    }
  };

  /* ===============================
     DELETE ENQUIRY
  ================================ */
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/contact/${id}`,
        authHeader()
      );
      fetchContacts();
    } catch {
      alert('Error deleting enquiry');
    }
  };

  /* ===============================
     LOGIN PAGE
  ================================ */
  if (!isLoggedIn) {
    return (
      <section className="admin auth">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            required
          />
          <button className="btn">Login</button>
        </form>
      </section>
    );
  }

  /* ===============================
     ADMIN PANEL
  ================================ */
  return (
    <section className="admin">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ANALYTICS */}
      <h3>Analytics Overview</h3>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {[
          { label: 'Products', value: analytics.totalProducts },
          { label: 'Total Stock', value: analytics.totalStock },
          { label: 'Low Stock Items', value: analytics.lowStock },
          { label: 'Enquiries', value: analytics.enquiries },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: '#fff',
              padding: '15px',
              borderRadius: '8px',
              width: '220px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <strong>{item.label}</strong>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* UPLOAD */}
      <h3>Upload New Timber</h3>
      <form onSubmit={handleUpload} className="admin-upload-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          required
        />
        <input
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />
        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="file"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files[0] })
          }
          required
        />
        <button className="btn">Upload</button>
      </form>

      {/* STOCK LIST */}
      <h3>Current Stock</h3>
      <div className="woods-grid">
        {woods.map((wood) => (
          <div key={wood._id} className="wood-card">
            {editId === wood._id ? (
              <>
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stock: e.target.value })
                  }
                />
                <input
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                />
                <button className="btn" onClick={() => saveEdit(wood._id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <h4>{wood.name}</h4>
                <p>{wood.description}</p>
                <p>Stock: {wood.stock}</p>
                <p>₹{wood.price}</p>
                <button className="btn" onClick={() => startEdit(wood)}>
                  Edit
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleDelete(wood._id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ENQUIRIES */}
      <h3>Customer Enquiries</h3>
      <div className="contact-list">
        {contacts.map((c) => (
          <div key={c._id} className="contact-card">
            <p><strong>Name:</strong> {c.name}</p>
            <p><strong>Phone:</strong> {c.phone}</p>
            {c.email && <p><strong>Email:</strong> {c.email}</p>}
            <p>{c.message}</p>
            <button
              className="btn btn-secondary"
              onClick={() => handleDeleteContact(c._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminPage;
