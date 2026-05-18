// src/lib/mockData.js

// 1. MOCK USERS (Tuân thủ snake_case)
export const MOCK_USERS_DATA = Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    const names = ["Võ Thanh Huy", "Nguyễn Văn An", "Trần Thị Bình", "Lê Hoàng Cường", "Phạm Đạt Đức", "Hoàng Yến Vân", "Đỗ Minh Hải", "Vũ Kiều Khanh", "Bùi Tiến Long", "Phan Hồng Nhung", "Ngô Quốc Phương", "Dương Minh Quân", "Lý Thanh Sơn", "Đặng Thúy Trang", "Trịnh Quốc Việt", "Vương Gia Bảo", "Tống Khánh Linh", "Đinh Gia Huy", "Phùng Mỹ Tâm", "Lâm Thế Vinh"];
    const usernames = ["huy.vothanh", "an.nguyen", "binh.tran", "cuong.le", "duc.pham", "van.hoang", "hai.do", "khanh.vu", "long.bui", "nhung.phan", "phuong.ngo", "quan.duong", "son.ly", "trang.dang", "viet.trinh", "bao.vuong", "linh.tong", "huy.dinh", "tam.phung", "vinh.lam"];
    
    return {
        id: id,                                    // Bổ sung id (Long)
        username: usernames[i],
        fullName: names[i],
        email: `${usernames[i]}@vti.com.vn`,
        phone: `090${String(1000000 + id).substring(1)}`,
        roleId: (id % 3) + 1,                      // Bổ sung roleId (Long)
        branchId: (id % 3) + 1,
        teamId: (id % 5) + 1,
        status: id % 10 === 0 ? "INACTIVE" : "ACTIVE", // Bổ sung status (UserStatus Enum dạng String)
        createdAt: `2026-01-${String(10 + id).substring(0, 2)}T08:30:00` // Bổ sung createdAt (LocalDateTime)
    };
});

// 2. MOCK CUSTOMERS (Tuân thủ camelCase)
export const MOCK_CUSTOMERS_DATA = Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    const isOrg = id % 2 === 0;
    const companyNames = ["Công ty VTI Tech", "Tập đoàn FPT", "Viettel Group", "Logistics Toàn Cầu", "Bất động sản Đất Xanh", "Thương mại Điện tử Tiki", "Chuỗi Cafe Highlands", "Sữa Việt Nam Vinamilk", "Nội thất Hòa Phát", "Xây dựng Coteccons"];
    const personalNames = ["Nguyễn Văn Thắng", "Lê Thị Mai", "Trần Hồng Phúc", "Phạm Minh Trí", "Hoàng Thanh Thảo", "Vũ Đình Nguyên", "Đỗ Hải Yến", "Bùi Quốc Anh", "Phan Minh Tuấn", "Dương Thúy Quỳnh"];
    
    return {
        id: id,
        customerCode: `CUST-${String(1000 + id).substring(1)}`,
        name: isOrg ? companyNames[Math.floor(i / 2)] : personalNames[Math.floor(i / 2)],
        shortName: isOrg ? `Org ${id}` : `Pers ${id}`,
        isOrganization: isOrg,
        taxCode: isOrg ? `0102030${id}` : null,
        citizenId: isOrg ? null : `07909900${1000 + id}`,
        foundedDate: isOrg ? `201${id % 9}-05-12` : null,
        website: isOrg ? `https://company-${id}.com` : "",
        emailOfficial: isOrg ? `info@company-${id}.com` : `customer${id}@gmail.com`,
        mainPhone: `02473000${String(10 + id)}`,
        fax: isOrg ? `02473000${String(50 + id)}` : null,
        addressCompany: `${id * 12} Đường số ${id}, Quận ${1 + (id % 12)}, TP. HCM`,
        addressBilling: `${id * 12} Đường số ${id}, Quận ${1 + (id % 12)}, TP. HCM`,
        description: `Khách hàng tiềm năng cao phân khúc ${isOrg ? 'Doanh nghiệp' : 'Cá nhân'}`,
        statusId: (id % 2) + 1,
        statusName: id % 2 === 0 ? "Đang hoạt động" : "Tạm ngưng",
        rankId: (id % 4) + 1,
        rankName: ["Bạc", "Vàng", "Bạch Kim", "Kim Cương"][id % 4],
        sourceId: (id % 3) + 1,
        campaignId: id % 5 === 0 ? null : (id % 5),
        primaryContactId: 100 + id,
        branchId: (id % 3) + 1,
        provinceId: 10 + id,
        assignedUserId: (id % 20) + 1,
        createdAt: `2026-01-${String(10 + id)}T08:00:00`,
        updatedAt: `2026-04-${String(10 + id)}T14:30:00`
    };
});

// 3. MOCK LEADS (Tuân thủ camelCase)
export const MOCK_LEADS_DATA = Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    const leadsNames = ["Trần Bảo Long", "Phạm Xuân Mạnh", "Nguyễn Tuấn Hải", "Lê Văn Xuân", "Đỗ Duy Mạnh", "Bùi Hoàng Việt Anh", "Phan Tuấn Tài", "Khuất Văn Khang", "Nguyễn Thanh Nhàn", "Vũ Tiến Long", "Đặng Văn Lâm", "Quế Ngọc Hải", "Bùi Tiến Dũng", "Nguyễn Phong Hồng Duy", "Vũ Văn Thanh", "Nguyễn Tuấn Anh", "Lương Xuân Trường", "Nguyễn Công Phượng", "Nguyễn Văn Toàn", "Nguyễn Tiến Linh"];
    const statusNames = ["Mới tạo", "Đang tiếp cận", "Nuôi dưỡng", "Chuyển đổi thành công", "Thất bại"];

    return {
        id: id,
        fullName: leadsNames[i],
        companyName: `Khởi nghiệp ${id}`,
        phone: `0966${String(100000 + id).substring(1)}`,
        email: `lead${id}@gmail.com`,
        website: `https://lead-${id}.vn`,
        taxCode: `03112233${String(10 + id)}`,
        citizenId: `03409900${1000 + id}`,
        address: `${id * 5} Lê Lai, Phường Bến Thành, Quận 1, TP. HCM`,
        expectedRevenue: 50000000 + (id * 15000000),
        description: `Lead thu thập từ sự kiện Tech Expo 2026 - Nhu cầu nhóm ${id}`,
        totalCalls: id % 4,
        totalEmails: id % 3,
        totalMeetings: id % 2,
        provinceId: 79,
        branchId: (id % 3) + 1,
        sourceId: (id % 4) + 1,
        sourceName: ["Google Search", "Facebook Ads", "Giới thiệu", "Direct"][id % 4],
        campaignId: (id % 5) + 1,
        campaignName: `Chiến dịch Marketing Q${(id % 4) + 1}`,
        assignedTo: (id % 20) + 1,
        createdBy: ((id + 1) % 20) + 1,
        updatedBy: ((id + 2) % 20) + 1,
        statusId: (id % 5) + 1,
        statusName: statusNames[id % 5],
        createdAt: `2026-03-${String(10 + id)}T09:15:00`,
        updatedAt: `2026-05-${String(10 + id)}T16:20:00`
    };
});

// 4. MOCK OPPORTUNITIES (Tuân thủ camelCase)
export const MOCK_OPPORTUNITIES_DATA = Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    const stages = ["Mở đầu", "Khảo sát nhu cầu", "Chào giá/Đề xuất", "Đàm phán", "Ký hợp đồng", "Đóng thành công", "Đóng thất bại"];
    const statusNames = ["Đang mở", "Thành công", "Thất bại"];
    const total = 100000000 + (id * 20000000);
    const deposit = total * 0.2;

    return {
        id: id,
        opportunityCode: `OPP-2026-${String(100 + id).substring(1)}`,
        name: `Dự án mua sắm thiết bị CNTT gói #${id}`,
        customerId: (id % 20) + 1, // Khớp nối ngẫu nhiên từ 1 đến 20 của mockCustomers
        stageId: (id % 7) + 1,
        stageName: stages[id % 7],
        statusId: (id % 3) + 1,
        statusName: statusNames[id % 3],
        lostReasonId: id % 3 === 2 ? 1 : null,
        lostReasonName: id % 3 === 2 ? "Giá quá cao so với đối thủ" : null,
        totalAmount: total,
        depositAmount: deposit,
        remainingAmount: total - deposit,
        probability: 10 * (id % 10 + 1)
    };
});
// Helper function: Lấy tên linh hoạt theo cấu trúc DTO từ Backend
export const getNameById = (id, dataArray) => {
  // Ép kiểu về Number để so sánh an toàn, tránh lỗi string vs number
  const item = dataArray.find(item => Number(item.id) === Number(id));
  
  if (!item) return `ID #${id}`;
  
  // Ưu tiên lấy name hoặc fullName tùy thuộc vào thực thể
  return item.name || item.fullName || `ID #${id}`;
};
// 5. MOCK CONTACTS DATA (Khớp 100% với ContactResponse từ Backend)
export const MOCK_CONTACTS_DATA = Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    const firstNames = ["Huy", "An", "Bình", "Cường", "Đức", "Vân", "Hải", "Khanh", "Long", "Nhung", "Phương", "Quân", "Sơn", "Trang", "Việt", "Bảo", "Linh", "Hùng", "Tâm", "Vinh"];
    const lastNames = ["Võ Thanh", "Nguyễn Văn", "Trần Thị", "Lê Hoàng", "Phạm Đạt", "Hoàng Yến", "Đỗ Minh", "Vũ Kiều", "Bùi Tiến", "Phan Hồng", "Ngô Quốc", "Dương Minh", "Lý Thanh", "Đặng Thúy", "Trịnh Quốc", "Vương Gia", "Tống Khánh", "Đinh Gia", "Phùng Mỹ", "Lâm Thế"];
    const jobTitles = ["Giám đốc Công nghệ", "Trưởng phòng Kinh doanh", "Chuyên viên Marketing", "Kế toán trưởng", "Giám đốc Nhân sự", "Trưởng phòng Mua hàng", "Chuyên viên Kỹ thuật", "Quản lý Dự án", "Trợ lý Giám đốc", "Chuyên viên CSKH"];
    
    // Đồng bộ tên công ty dựa theo logic tạo ID của MOCK_CUSTOMERS_DATA lúc nãy
    const companyNames = ["Công ty VTI Tech", "Tập đoàn FPT", "Viettel Group", "Logistics Toàn Cầu", "Bất động sản Đất Xanh", "Thương mại Điện tử Tiki", "Chuỗi Cafe Highlands", "Sữa Việt Nam Vinamilk", "Nội thất Hòa Phát", "Xây dựng Coteccons"];
    const customerId = (id % 20) + 1;
    const isOrg = customerId % 2 === 0;
    const custName = isOrg ? companyNames[Math.floor((customerId - 1) / 2) % companyNames.length] : `${lastNames[(customerId - 1) % 20]} ${firstNames[(customerId - 1) % 20]}`;

    return {
        id: id,
        customerId: customerId,
        customerName: custName,
        firstName: firstNames[i],
        lastName: lastNames[i],
        fullName: `${lastNames[i]} ${firstNames[i]}`,
        jobTitle: jobTitles[id % jobTitles.length],
        birthday: `199${id % 10}-0${(id % 9) + 1}-15`,
        personalEmail: `contact.${firstNames[i].toLowerCase()}${id}@gmail.com`,
        personalPhone: `0933${String(100000 + id).substring(1)}`,
        isPrimary: id % 3 === 0, // Giả lập: cứ mỗi 3 người thì có 1 người là liên hệ chính
        createdAt: `2026-02-${String(10 + id).substring(0, 2)}T10:15:00`,
        updatedAt: `2026-04-${String(10 + id).substring(0, 2)}T11:45:00`
    };
});
// Helper function: Lấy tên thực thể liên quan (Polymorphic Lookup)
export const getRelatedName = (relateType, relateId) => {
  if (!relateType || !relateId) return '-';
  
  switch (relateType) {
    case 'LEAD': 
      return getNameById(relateId, MOCK_LEADS_DATA); // Truyền mảng 20 items đã tạo vào đây
    case 'CUSTOMER': 
      return getNameById(relateId, MOCK_CUSTOMERS_DATA);
    case 'OPPORTUNITY': 
      return getNameById(relateId, MOCK_OPPORTUNITIES_DATA);
    case 'USER': 
      return getNameById(relateId, MOCK_USERS_DATA);
    default: 
      return `${relateType} #${relateId}`;
  }
};