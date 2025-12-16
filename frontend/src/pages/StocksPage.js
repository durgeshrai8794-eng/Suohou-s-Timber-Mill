import React, { useEffect, useState } from "react";
import axios from "axios";

function StocksPage() {
  const [woods, setWoods] = useState([]);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchWoods();
  }, []);

  const fetchWoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/woods");
      setWoods(res.data);
    } catch (err) {
      console.error("Error fetching woods:", err);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredWoods = woods.filter((wood) => {
    const matchesName = wood.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPrice =
      maxPrice === "" || wood.price <= Number(maxPrice);

    return matchesName && matchesPrice;
  });

  /* ================= AVAILABILITY ================= */
  const getAvailability = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Limited Stock";
    return "In Stock";
  };

  /* ================= WHATSAPP ================= */
  const openWhatsApp = (wood) => {
    const phoneNumber = "919856309485"; // ✅ use only digits

    const message = `Hello, I'm interested in ${wood.name}.
Price: ₹${wood.price}.
Please share more details.`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <section className="inventory">
      {/* PAGE HEADER */}
      <div className="inventory-header">
        <h2>Available Timber Stock</h2>
        <p>
          Browse our premium quality wood collection. Use filters to find the
          perfect timber for your project.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar enhanced">
        <input
          type="text"
          placeholder="🔍 Search wood name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="💰 Max price (₹)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* EMPTY STATE */}
      {filteredWoods.length === 0 ? (
        <div className="empty-state">
          <p>No matching stock found.</p>
        </div>
      ) : (
        <div className="woods-grid">
          {filteredWoods.map((wood) => (
            <div key={wood._id} className="wood-card">
              {/* IMAGE */}
              {wood.image ? (
                <img
                  src={`http://localhost:5000/uploads/${wood.image}`}
                  alt={wood.name}
                />
              ) : (
                <div className="image-placeholder">No Image</div>
              )}

              {/* CONTENT */}
              <div className="wood-content">
                <h3>{wood.name}</h3>
                <p className="wood-desc">{wood.description}</p>

                <div className="wood-meta">
                  <span>₹ {wood.price}</span>
                  <span>Stock: {wood.stock}</span>
                </div>

                {/* AVAILABILITY */}
                <span
                  className={`badge ${
                    getAvailability(wood.stock)
                      .replace(" ", "-")
                      .toLowerCase()
                  }`}
                >
                  {getAvailability(wood.stock)}
                </span>

                {/* CTA */}
                <button
                  className="btn whatsapp full"
                  onClick={() => openWhatsApp(wood)}
                >
                  Request Quote on WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default StocksPage;
