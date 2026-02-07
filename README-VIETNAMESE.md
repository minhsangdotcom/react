# React Template

## Giới thiệu
Một template React CMS theo cấu trúc feature-based được thiết kế để hoạt động liền mạch với [Clean Architecture .NET template](https://github.com/minhsangdotcom/clean-architecture).

## Cho một :star:
Nếu bạn thấy hữu ích hoặc học được điều gì đó từ nó, hãy cho nó một :star:

## Cấu trúc Feature-Based :rocket:
Cấu trúc feature-based tổ chức code theo các tính năng hoặc Domain của nghiệp vụ thay vì theo các layer. Mỗi thư mục feature chứa tất cả các components, hooks, utilities, styles và tests liên quan cần thiết để tính năng đó hoạt động độc lập.

### Ưu điểm
- **Tính liên kết cao** - Code liên quan được giữ cùng nhau, giúp các tính năng dễ hiểu và dễ chỉnh sửa hơn
- **Khả năng mở rộng** - Dễ dàng thêm tính năng mới mà không ảnh hưởng đến cấu trúc hiện có
- **Cộng tác nhóm** - Nhiều developer có thể làm việc với xung đột tối thiểu
- **Dễ bảo trì** - Các thay đổi được cô lập trong từng tính năng cụ thể

### Nhược điểm
- **Độ phức tạp ban đầu** - Yêu cầu lên kế hoạch trước cho ranh giới các tính năng
- **Khả năng trùng lặp** - Rủi ro tạo lại các component tương tự giữa các tính năng
- **Ranh giới không rõ ràng** - Một số chức năng có thể mơ hồ giữa các tính năng

## :file_folder: Cấu trúc dự án
```
src/
├── assets/          # Các file tĩnh (hình ảnh, font chữ, icon)
├── components/      # Các UI component có thể tái sử dụng
├── config/          # Các file cấu hình ứng dụng
├── design-system/   # Design tokens và cấu hình theme
├── features/        # Các module theo tính năng
├── hooks/           # Custom React hooks
├── layouts/         # Các component bố cục trang
├── lib/             # Cấu hình thư viện bên thứ ba
├── locales/         # Các file dịch đa ngôn ngữ (i18n)
├── notifications/   # Tiện ích hệ thống thông báo
├── routes/          # Cấu hình định tuyến
├── services/        # API calls và các dịch vụ bên ngoài
├── store/           # Quản lý state (Redux/Zustand)
├── styles/          # Global styles và CSS modules
├── types/           # Định nghĩa kiểu TypeScript
├── utils/           # Các hàm tiện ích và helper
├── App.tsx          # Component ứng dụng gốc
├── i18n.d.ts        # Khai báo TypeScript cho i18n
├── i18n.ts          # Cấu hình i18n
├── index.css        # Global CSS styles
├── main.tsx         # Entry point của ứng dụng
└── vite-env.d.ts    # Định nghĩa kiểu môi trường Vite
```


## Tính năng :sparkles: 

1. :lock: **Xác thực** – Đăng nhập & Quên mật khẩu  
2. :bust_in_silhouette: **Quản lý hồ sơ** – Cập nhật hồ sơ & Đổi mật khẩu  
3. :shield: **Quản lý vai trò**  
4. :busts_in_silhouette: **Quản lý người dùng**  
5. :globe_with_meridians: **Hỗ trợ đa ngôn ngữ (i18n)**  
6. :mag: **Xử lý dữ liệu** – Sắp xếp, Tìm kiếm, Lọc (LHS Bracket), Phân trang (Offset & Cursor), tương thích hoàn toàn với [Clean Architecture .NET template](https://github.com/minhsangdotcom/clean-architecture)  
7. :iphone: **Giao diện responsive hoàn toàn** – Tối ưu cho mọi kích thước màn hình

## Một số ảnh chụp màn hình :fire:

<p align="center">
  <img src="/screenshot/login.png" alt="Login" width="720" /><br />
  <img src="/screenshot/forgot-password.png" alt="Forgot Password" width="720" /><br />
  <img src="/screenshot/reset-password.png" alt="Reset Password" width="720" /><br />
  <img src="/screenshot/profile.png" alt="Profile" width="720" /><br />
  <img src="/screenshot/change-password.png" alt="Change Password" width="720" /><br />
  <img src="/screenshot/home.png" alt="Home" width="720" /><br />
  <img src="/screenshot/role.png" alt="Role Management" width="720" /><br />
  <img src="/screenshot/create-role.png" alt="Create Role" width="720" /><br />
  <img src="/screenshot/user.png" alt="User Management" width="720" /><br />
  <img src="/screenshot/create-user.png" alt="Create User" width="720" /><br />
  <img src="/screenshot/update-user.png" alt="Update User" width="720" /><br />
  <img src="/screenshot/data-hanling.png" alt="Data Handling" width="720" /><br />
</p>

<p align="center">
  <img src="/screenshot/home-mobile.png" width="220" />
  <img src="/screenshot/role-mobile.png" width="220" />
  <img src="/screenshot/create-role-mobile.png" width="220" />
</p>

<p align="center">
  <img src="/screenshot/user-mobile.png" width="220" />
  <img src="/screenshot/user-mobile-2.png" width="220" />
  <img src="/screenshot/update-user-mobile.png" width="220" />
</p>

## :package: Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Cài đặt dependencies
```bash
npm install
# hoặc
yarn --network-timeout 1000000000
```

### 3. Thiết lập môi trường
Tạo file `.env.development` trong thư mục gốc:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_HOST_PORT=3000
VITE_STORAGE_PREFIX=theTemplate_
VITE_DEFAULT_LANGUAGE=vi
VITE_SUPPORTED_LANGUAGES=en,vi
```

> **Lưu ý:** `http://localhost:8080/api/v1` trỏ đến .NET backend template. Đảm bảo backend của bạn đang chạy trên URL này.

### 4. Chạy development server
```bash
yarn dev
```

Ứng dụng sẽ có sẵn tại `http://localhost:3000`

## Tech Stack

- **React** - Thư viện UI
- **TypeScript** - JavaScript có kiểu dữ liệu
- **Vite** - Build tool và dev server
- **React Router DOM** - Định tuyến phía client
- **Redux Toolkit** - Quản lý state
- **Tailwind CSS** - CSS framework tiện ích
- **Radix UI** - Headless UI components
- **React Hook Form** - Quản lý form
- **Zod** - Schema validation
- **Axios** - HTTP client
- **i18next** - Đa ngôn ngữ

## Giấy phép

Dự án này thuộc [Giấy phép MIT](/LICENSE).