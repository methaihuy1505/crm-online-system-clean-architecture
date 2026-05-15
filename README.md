# CRM Online System

> **Hệ thống Quản trị Quan hệ Khách hàng (CRM) phân cấp quy mô tập đoàn, tối ưu hóa luồng dữ liệu từ tiếp cận (Lead) đến chốt thương vụ (Opportunity). Nền tảng Backend được thiết kế theo chuẩn Domain-Driven Design (DDD) và Clean Architecture để tối đa hóa khả năng mở rộng và bảo trì dài hạn.**

---

## 1. Giới thiệu dự án
Dự án tập trung vào việc xây dựng một hệ thống CRM mạnh mẽ cho doanh nghiệp đa chi nhánh. Hệ thống giải quyết các bài toán về:
* **Điều phối tự động:** Tự động gán khách hàng cho chi nhánh dựa trên vùng địa lý.
* **Quản lý bán hàng chuyên nghiệp:** Theo dõi chặt chẽ Pipeline, sản phẩm, thuế và chiết khấu.
* **Năng suất nhân sự:** Giao việc và truy vết nhật ký tương tác thực tế (Traceability).

## 2. Các Tính năng Cốt lõi

**Quản trị Tổ chức & Phân quyền (RBAC)**
* **Cơ cấu đa tầng:** Quản lý theo Chi nhánh (Branch) -> Phòng ban (Team) -> Nhân viên (User).
* **Phân quyền chức năng:** Kiểm soát chi tiết hành động qua `permission_key` (Xem, Thêm, Sửa, Xóa).
* **Bảo mật dữ liệu:** Nhân viên chỉ được tiếp cận dữ liệu khách hàng trong phạm vi chi nhánh hoặc nhóm của mình.

**Quản lý Khách hàng Tiềm năng (Lead)**
* **Territory Management:** Tự động điều phối Lead về chi nhánh quản lý ngay khi khách hàng để lại thông tin dựa trên quy tắc vùng địa lý.
* **Communication Details:** Quản lý đa kênh liên lạc (Zalo, Skype, Facebook, Email, Phone) linh hoạt.

**Quản lý Thương vụ & Bán hàng (Opportunity)**
* **Sales Pipeline:** Quản lý cơ hội qua các giai đoạn (`stages`) với xác suất thành công (`probability`) và lý do thất bại (`lost_reasons`).
* **Snapshot Pricing:** Bảo toàn dữ liệu lịch sử tài chính (đơn giá, thuế VAT, chiết khấu) tại thời điểm bán để không bị ảnh hưởng khi giá sản phẩm gốc thay đổi.

**Vận hành & Năng suất (Tasks & Activities)**
* **Task Scheduling:** Giao việc có ngày bắt đầu, kết thúc và mức độ ưu tiên (`priority`).
* **Activity Logging:** Nhật ký tương tác thực tế (Call, Meeting, Note) liên kết chặt chẽ với Task để đo lường hiệu suất thực tế của nhân viên.

---

## 3. Kiến trúc Hệ thống (Clean Architecture & DDD)
Hệ thống từ bỏ cách thiết kế phụ thuộc vào Database truyền thống. Cơ sở dữ liệu (MySQL) giờ đây chỉ được xem là một "chi tiết hạ tầng" (Infrastructure Detail). 

### 3.1. Phân rã Bounded Contexts (Theo ngữ cảnh nghiệp vụ)
Hệ thống được chia nhỏ thành các giới hạn ngữ cảnh độc lập, tiền đề vững chắc để chuyển đổi sang Microservices khi cần thiết:
* **IAM Context (Identity & Access):** Quản lý Users, Roles, Permissions, Branches và Teams.
* **Customer Context:** Quản lý vòng đời Leads, Customers và Territory Routing.
* **Sales Context:** Trọng tâm là Aggregate `Opportunity`, theo dõi Pipeline, Stages và Products.
* **Operations Context:** Quản lý Tasks, Activities và Customer Feedback.

### 3.2. Cấu trúc Các Lớp (Clean Architecture Layers)
Quy tắc phụ thuộc một chiều (Dependency Rule): Các lớp bên ngoài phụ thuộc vào lớp bên trong. Lớp Core ở giữa không biết gì về các lớp bên ngoài.
1. **Domain Layer (Core):** Trái tim của hệ thống. Chứa các Aggregate Roots (như `Opportunity`, `Lead`), Entities, và Value Objects (như `Money`, `CommunicationType`). Tuyệt đối không chứa framework code (như Spring hay JPA).
2. **Application Layer (Use Cases):** Điều phối luồng nghiệp vụ. Ví dụ: `AssignLeadToBranchUseCase`, `CloseOpportunityUseCase`.
3. **Infrastructure Layer:** Cấu hình Database (Spring Data JPA), thực thi các Interface của Repository được định nghĩa ở Domain, gửi Email, tích hợp API bên ngoài (Adapter).
4. **Interface Layer:** Các RESTful API Controllers tiếp nhận Request từ Client, chuyển đổi thành DTO và đẩy vào Use Cases.

---

## 4. Điểm nhấn Kỹ thuật (Key Technical Points)

* **Domain Events (Sự kiện nghiệp vụ):** Giảm thiểu sự dính chặt (Coupling) giữa các module. Ví dụ: Khi Use Case `ConvertLeadUseCase` chạy thành công, nó sẽ phát ra một sự kiện `LeadConvertedToCustomerEvent`. Module Operations lắng nghe sự kiện này để tự động sinh ra một `Task` chăm sóc khách hàng mới mà không cần gọi trực tiếp code của nhau.
* **Value Objects bảo vệ toàn vẹn dữ liệu:** Tính năng **Snapshot Pricing** được thiết kế dưới dạng một Value Object (ví dụ: `PriceSnapshot` gồm Amount, Currency, TaxRate). Vì Value Object mang tính chất "bất biến" (Immutable), hệ thống đảm bảo lịch sử giá trị thương vụ không bao giờ bị sai lệch.
* **Repository Pattern & Dependency Inversion:** Logic nghiệp vụ không lưu dữ liệu trực tiếp bằng thư viện SQL. Thay vào đó, Domain định nghĩa các `IOpportunityRepository` interfaces. Infrastructure sẽ implement các interface này. Việc này giúp hệ thống dễ dàng thay đổi từ MySQL sang MongoDB hay PostgreSQL mà không phải viết lại logic bán hàng.
* **Ubiquitous Language (Ngôn ngữ chung):** Mã nguồn (Code), tên class, và tên hàm phản ánh chính xác 100% ngôn ngữ nghiệp vụ của quy trình Sales thực tế, giúp thu hẹp khoảng cách giữa Đội ngũ Phát triển và Khối Kinh doanh.