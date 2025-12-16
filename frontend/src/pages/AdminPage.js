import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [woods, setWoods] = useState([]);
  const [contacts, setContacts] = useState([]);

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
     LOGIN (JWT)
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
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
  };

  /* ===============================
     UPLOAD
  ================================ */
  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('stock', form.stock);
    formData.append('price', form.price);
    if (form.image) formData.append('image', form.image);

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
    } catch (err) {
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
    } catch (err) {
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

  const cancelEdit = () => setEditId(null);

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
    } catch (err) {
      alert('Error updating item');
    }
  };

  /* ===============================
     DELETE ENQUIRY (NEW)
  ================================ */
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/contact/${id}`,
        authHeader()
      );
      fetchContacts();
    } catch (err) {
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
            type="text"
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
          <button type="submit" className="btn">
            Login
          </button>
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
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <h3>Upload New Timber</h3>
      <form onSubmit={handleUpload} className="admin-upload-form">
        <input
          type="text"
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
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
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
        <button type="submit" className="btn">
          Upload
        </button>
      </form>

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
                <button className="btn btn-secondary" onClick={cancelEdit}>
                  Cancel
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
