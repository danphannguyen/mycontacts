import { useEffect, useState } from "react";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../api/contacts";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

export default function HomePage() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [form, setForm] = useState({ firstname: "", lastname: "", phone: "" });

  // === Fetch contacts ===
  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await getContacts(token);
        if (res.success) {
          setContacts(res.data);
        } else {
          setError(res.message || "Erreur inconnue");
        }
      } catch (err) {
        setError(err.message);
      }
    }

    if (token) fetchContacts();
  }, [token]);

  // === Handle form input ===
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === Open modal for add/edit ===
  const openModal = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setForm({
        firstname: contact.firstname,
        lastname: contact.lastname,
        phone: contact.phone,
      });
    } else {
      setEditingContact(null);
      setForm({ firstname: "", lastname: "", phone: "" });
    }
    setIsModalOpen(true);
  };

  // === Save contact ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await updateContact(editingContact._id, form, token);
      } else {
        await createContact(form, token);
      }
      setIsModalOpen(false);
      setForm({ firstname: "", lastname: "", phone: "" });
      setEditingContact(null);
      const res = await getContacts(token);
      setContacts(res.data);
    } catch (err) {
      alert(err.message);
    }
  };

  // === Delete contact ===
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce contact ?")) {
      try {
        await deleteContact(id, token);
        setContacts((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="home-container">
        <div className="header">
          <h2>📇 Liste des contacts</h2>
          <button className="add-btn" onClick={() => openModal()}>
            + Ajouter
          </button>
        </div>

        {contacts.length === 0 ? (
          <p>Aucun contact trouvé.</p>
        ) : (
          <ul className="contact-list">
            {contacts.map((c) => (
              <li key={c._id} className="contact-card">
                <div className="contact-info">
                  <p>
                    <strong>Prénom :</strong> {c.firstname || "—"}
                  </p>
                  <p>
                    <strong>Nom :</strong> {c.lastname || "—"}
                  </p>
                  <p>
                    <strong>Téléphone :</strong> {c.phone || "—"}
                  </p>
                </div>
                <div className="contact-actions">
                  <button onClick={() => openModal(c)} className="edit-btn">
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="delete-btn"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {editingContact ? "Modifier le contact" : "Ajouter un contact"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label for="firstname">Prénom</label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="Prénom"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label for="lastname">Nom</label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Nom"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label for="lastname">Numéro de téléphone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Téléphone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-btn"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
