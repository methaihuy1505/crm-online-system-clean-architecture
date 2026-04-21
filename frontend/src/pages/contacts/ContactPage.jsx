import React, { useState, useEffect } from "react";
import axios from "axios";
import ContactHeader from "./components/ContactHeader";
import ContactFilter from "./components/ContactFilter";
import ContactGrid from "./components/ContactGrid";
import ContactDetailPanel from "./components/ContactDetailPanel";
import ContactFormModal from "./components/ContactFormModal";

const ContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [customers, setCustomers] = useState([]); // Data để đổ vào dropdown Form
  const [isLoading, setIsLoading] = useState(true);

  // State Panel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // State Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [contactRes, customerRes] = await Promise.all([
        axios.get("http://localhost:8080/api/v1/contacts"),
        axios.get("http://localhost:8080/api/v1/customers"),
      ]);
      setContacts(contactRes.data);
      setCustomers(customerRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleOpenDetail = (contact) => {
    setSelectedContact(contact);
    setIsPanelOpen(true);
  };
  const handleCloseDetail = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedContact(null), 300);
  };

  const handleOpenAdd = () => {
    setContactToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (contact) => {
    setContactToEdit(contact);
    setIsFormOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa Liên hệ "${name}" không?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/contacts/${id}`);
        fetchData();
        if (selectedContact?.id === id) handleCloseDetail();
      } catch (error) {
        console.error("Lỗi khi xóa Liên hệ!", error);
      }
    }
  };

  return (
    <div className="relative">
      <ContactHeader
        totalContacts={contacts.length}
        onOpenAdd={handleOpenAdd}
      />

      <ContactFilter contacts={contacts} />

      {isLoading ? (
        <div className="p-10 text-center text-slate-500 font-medium">
          Đang tải dữ liệu...
        </div>
      ) : (
        <ContactGrid
          contacts={contacts}
          onOpenDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <ContactDetailPanel
        isOpen={isPanelOpen}
        onClose={handleCloseDetail}
        contact={selectedContact}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <ContactFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={contactToEdit}
        onSuccess={fetchData}
        customers={customers}
      />
    </div>
  );
};

export default ContactPage;
