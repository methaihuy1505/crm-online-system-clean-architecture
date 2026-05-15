// frontend/src/mockdata/mockdata.jsx
export const MOCK_USERS_DATA = [
  { id: 1, name: "Admin User" },
  { id: 101, name: "Trần Thị B (Sales)" },
  { id: 102, name: "Lê Văn C (Marketing)" },
  { id: 205, name: "Phạm Văn D (Support)" },
];

export const MOCK_LEADS_DATA = [
  { id: 10, name: "Lead A (Công ty ABC)" },
  { id: 11, name: "Lead B (Startup XYZ)" },
];

export const MOCK_CUSTOMERS_DATA = [
  { id: 12, name: "Khách hàng X (VTI)" },
  { id: 13, name: "Khách hàng Y (FPT)" },
];

export const MOCK_OPPORTUNITIES_DATA = [
  { id: 50, name: "Cơ hội P (Dự án Lớn)" },
  { id: 51, name: "Cơ hội Q (Dự án Nhỏ)" },
];

// Helper function to get name from ID and data array
export const getNameById = (id, dataArray) => {
  const item = dataArray.find(item => item.id === id);
  return item ? item.name : `ID #${id}`;
};

// Helper function to get related entity name
export const getRelatedName = (relateType, relateId) => {
  if (!relateType || !relateId) return '-';
  switch (relateType) {
    case 'LEAD': return getNameById(relateId, MOCK_LEADS_DATA);
    case 'CUSTOMER': return getNameById(relateId, MOCK_CUSTOMERS_DATA);
    case 'OPPORTUNITY': return getNameById(relateId, MOCK_OPPORTUNITIES_DATA);
    default: return `${relateType} #${relateId}`;
  }
};