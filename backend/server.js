const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

/* ===============================
   Middlewares
================================ */
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ===============================
   MongoDB Connection
================================ */
mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost:27017/timbermill',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

/* ===============================
   Schemas & Models
================================ */

// 🔐 Admin
const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});
const Admin = mongoose.model('Admin', adminSchema);

// 🌲 Wood
const woodSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  stock: Number,
  price: Number,
});
const Wood = mongoose.model('Wood', woodSchema);

// 📩 Contact
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const ContactMessage = mongoose.model('ContactMessage', contactSchema);

/* ===============================
   Multer Config
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ===============================
   JWT Middleware
================================ */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'SECRET_KEY'
    );
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/* ===============================
   ONE-TIME ADMIN CREATION
   ⚠️ USE ONCE THEN DELETE
================================ */

// app.post('/api/admin/create', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const exists = await Admin.findOne({ username });
//     if (exists) {
//       return res.status(400).json({ message: 'Admin already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const admin = new Admin({
//       username,
//       password: hashedPassword,
//     });

//     await admin.save();
//     res.json({ message: 'Admin created successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error creating admin' });
//   }
// });


/* ===============================
   ADMIN LOGIN (JWT)
================================ */
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'SECRET_KEY',
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

/* ===============================
   PUBLIC ROUTES
================================ */

// 🌲 Get woods (customers)
app.get('/api/woods', async (req, res) => {
  try {
    const woods = await Wood.find();
    res.json(woods);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching woods' });
  }
});

// 📩 Contact form
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new ContactMessage(req.body);
    await contact.save();
    res.json({ success: true, message: 'Message received' });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN PROTECTED ROUTES
================================ */

// ➕ Upload wood
app.post(
  '/api/woods',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, description, stock, price } = req.body;
      const image = req.file ? req.file.filename : '';

      const wood = new Wood({
        name,
        description,
        image,
        stock: Number(stock),
        price: Number(price),
      });

      await wood.save();
      res.json(wood);
    } catch (err) {
      res.status(500).json({ message: 'Error saving wood' });
    }
  }
);

// ✏ Update wood
app.put('/api/woods/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, stock, price } = req.body;

    const wood = await Wood.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        stock: Number(stock),
        price: Number(price),
      },
      { new: true }
    );

    if (!wood) {
      return res.status(404).json({ message: 'Wood not found' });
    }

    res.json(wood);
  } catch (err) {
    res.status(500).json({ message: 'Error updating wood' });
  }
});

// ❌ Delete wood
app.delete('/api/woods/:id', authMiddleware, async (req, res) => {
  try {
    const wood = await Wood.findByIdAndDelete(req.params.id);
    if (!wood) {
      return res.status(404).json({ message: 'Wood not found' });
    }
    res.json({ message: 'Wood deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting wood' });
  }
});

// 📩 Get contact messages
app.get('/api/contact', authMiddleware, async (req, res) => {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contact messages' });
  }
});

// ❌ Delete contact message (ADMIN ONLY)
app.delete('/api/contact/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('Delete contact error:', err);
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

/* ===============================
   ADMIN ANALYTICS (PHASE 7)
================================ */
app.get('/api/admin/analytics', authMiddleware, async (req, res) => {
  try {
    const totalProducts = await Wood.countDocuments();

    const totalStockAgg = await Wood.aggregate([
      { $group: { _id: null, total: { $sum: '$stock' } } }
    ]);

    const lowStockCount = await Wood.countDocuments({
      stock: { $lte: 10 }
    });

    const totalEnquiries = await ContactMessage.countDocuments();

    res.json({
      totalProducts,
      totalStock: totalStockAgg[0]?.total || 0,
      lowStockCount,
      totalEnquiries
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Analytics error' });
  }
});


/* ===============================
   START SERVER
================================ */
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
