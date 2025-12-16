import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StocksPage() {
  const [woods, setWoods] = useState([]);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchWoods();
  }, []);

  const fetchWoods = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/woods');
      setWoods(res.data);
    } catch (err) {
      console.error('Error fetching woods:', err);
    }
  };

  // ---------------- FILTER LOGIC ----------------
  const filteredWoods = woods.filter((wood) => {
    const matchesName = wood.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPrice =
      maxPrice === '' || wood.price <= Number(maxPrice);

    return matchesName && matchesPrice;
  });

  // ---------------- AVAILABILITY ----------------
  const getAvailability = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return 'Limited Stock';
    return 'In Stock';
  };

  // ---------------- WHATSAPP ----------------
  const openWhatsApp = (wood) => {
    const phoneNumber = '919999999999'; 
    // 🔴 Replace with your real WhatsApp number (country code required)

    const message = `Hello, I'm interested in ${wood.name}.
Price: ₹${wood.price}.
Please share more details.`;

    const url = `https://wa.me/${919856309485}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, '_blank');
  };

  return (
    <section className="inventory">
      <h2>Available Timber Stock</h2>

      {/* Search & Filter */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search wood name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max price (₹)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {filteredWoods.length === 0 ? (
        <p>No matching stock found.</p>
      ) : (
        <div className="woods-grid">
          {filteredWoods.map((wood) => (
            <div key={wood._id} className="wood-card">
              {wood.image && (
                <img
                  src={`http://localhost:5000/uploads/${wood.image}`}
                  alt={wood.name}
                />
              )}

              <h3>{wood.name}</h3>
              <p>{wood.description}</p>
              <p><strong>Price:</strong> ₹{wood.price}</p>
              <p><strong>Stock:</strong> {wood.stock}</p>

              {/* Availability Badge */}
              <span
                className={`badge ${
                  getAvailability(wood.stock)
                    .replace(' ', '-')
                    .toLowerCase()
                }`}
              >
                {getAvailability(wood.stock)}
              </span>

              {/* WhatsApp Button */}
              <button
                className="btn whatsapp"
                onClick={() => openWhatsApp(wood)}
                style={{ marginTop: '8px' }}
              >
                Request Quote
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default StocksPage;
