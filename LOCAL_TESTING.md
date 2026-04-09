# 🧪 LOCAL TESTING GUIDE

## **Bước 1: Test Backend Locally**

```bash
cd backend
npm install
npm run dev
```

Kiểm tra: http://localhost:5000
```
✅ Output: "API is running..."
```

---

## **Bước 2: Test Frontend Locally**

### Cách 1: HTTP Server
```bash
cd frontend
npx http-server
# hoặc: python -m http.server 8000
```

Truy cập: http://localhost:8000

### Cách 2: Live Server (VS Code Extension)
- Click chuột phải vào `frontend/index.html` → "Open with Live Server"

---

## **Bước 3: Test API Calls**

### Test Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'
```

Expected Response:
```json
{
  "_id": "...",
  "username": "testuser",
  "email": "test@example.com",
  "token": "eyJhbGc..."
}
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Test Get Profile (với token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Test Task","description":"This is a test","status":"todo"}'
```

---

## **Bước 4: Test Full Flow**

1. **Mở http://localhost:8000 → Redirect tới login.html** ✓
2. **Đăng ký tài khoản mới** → Kiểm tra localStorage có token ✓
3. **Đảm bảo Redirect tới dashboard** ✓
4. **Thêm task mới** → Check xem nó xuất hiện ✓
5. **Sửa task** → Verify update tới backend ✓
6. **Xóa task** → Verify delete tới backend ✓
7. **Xem Profile** → Hiển thị username/email đúng ✓
8. **Logout** → Token xóa, redirect login ✓

---

## **Bước 5: Check Console**

**Browser DevTools (F12)**
- Console: Không có lỗi
- Network: Tất cả API calls 200/201/object ko như 401/404
- Application → LocalStorage: `token` chứa JWT

**Backend Console**
- ✅ MongoDB Connected
- ✅ Server running at http://localhost:5000
- Không có stack trace errors

---

## **Troubleshooting**

### **"Cannot connect to MongoDB"**
```bash
# Check connection string in .env
# Ensure MongoDB Atlas IP whitelist includes your IP
```

### **"CORS error"**
```bash
# Check if backend running on http://localhost:5000
# frontend/js/api.js should use http://localhost:5000 for dev
```

### **"401 Unauthorized"**
```bash
# Token not sent properly
# Check localStorage has 'token'
# Verify Bearer format: "Bearer {token}"
```

### **"Not authorized" untuk tasks**
```bash
# JWT_SECRET mismatch antara backend dan token generation
# Verify JWT_SECRET dalam .env sama lúc generate token
```

---

## **Ready to Deploy** ✅

Sau khi pass tất cả tests trên, project sẵn sàng deploy!
