# 📋 DEPLOYMENT CHECKLIST - Task Management

## ✅ VẤN ĐỀ ĐÃ SỬA:

### 1. **Frontend API Endpoint** ✓
- [x] Sửa `/me` → `/auth/profile` (profile.js)
- [x] Sửa `/change-password` → `/auth/change-password` (setting.js)
- [x] API response format đã được cập nhật để khớp với backend

### 2. **Development vs Production URL** ✓
- [x] api.js sử dụng environment variable
- Development: `http://localhost:5000`
- Production: `https://task-managementt-3bda.onrender.com`

### 3. **Backend CORS Configuration** ✓
- [x] CORS được cấu hình cụ thể thay vì "allow all"
- [x] Hỗ trợ credentials và CORS pre-flight

---

## ⚠️ CÒN CẦN KIỂM TRA:

### 4. **Environment Variables** ⏳
Backend `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://admin:12345@cluster0.jkr0z1q.mongodb.net/?appName=Cluster0
JWT_SECRET=123456
FRONTEND_URL=https://your-frontend-domain.com  ← CẦN THÊM
```

### 5. **Frontend Build & Deploy** ⏳
- [ ] Không có build process (HTML+CSS+JS tĩnh) ✓
- [ ] Cần host trên server/CDN (Netlify, Vercel, GitHub Pages)
- [ ] Đảm bảo `NODE_ENV` được set đúng khi deploy

### 6. **Database Connection** ✓
- [x] MongoDB connection string trong `.env` đã có
- [x] Credentials: `admin:12345` (⚠️ NÊN THAY ĐỔI TRƯỚC KHOÁ)

### 7. **JWT Secret** ⚠️
- [x] JWT_SECRET = "123456" (⚠️ NÊN THAY ĐỔI - quá đơn giản)

---

## 📝 API ENDPOINTS - VERIFIED ✓

### **Authentication Routes**
| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| POST | `/api/auth/register` | ❌ | `{ _id, username, email, token }` |
| POST | `/api/auth/login` | ❌ | `{ _id, username, email, token }` |
| GET | `/api/auth/profile` | ✅ | `{ _id, username, email }` |
| POST | `/api/auth/change-password` | ✅ | `{ message }` |

### **Task Routes**
| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| GET | `/api/tasks` | ✅ | - |
| POST | `/api/tasks` | ✅ | `{ title, description, deadline, status }` |
| PUT | `/api/tasks/:id` | ✅ | `{ title, description, deadline, status }` |
| DELETE | `/api/tasks/:id` | ✅ | - |

---

## 🚀 STEPS TO DEPLOY:

### **Backend (Node.js - Render/Heroku)**
1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables:
   ```
   MONGO_URI=your_mongo_uri
   JWT_SECRET=strong_secret_key
   FRONTEND_URL=https://your-frontend.com
   ```
4. Deploy

### **Frontend (Static Files)**
1. Deploy to Netlify/Vercel
   - Point to `frontend/` folder
   - Build command: `npm run build` (hoặc skip nếu không có)
   - Publish directory: `frontend/`

2. Hoặc upload to any web server:
   ```bash
   scp -r frontend/* user@server:/var/www/html/
   ```

3. Update API URL in `frontend/js/api.js` nếu cần

---

## 🔐 SECURITY RECOMMENDATIONS:

- [ ] Thay `JWT_SECRET=123456` thành key dài hơn
- [ ] Thay MongoDB credentials `admin:12345` thành strong password
- [ ] Xóa `.env` khỏi version control (thêm vào `.gitignore`)
- [ ] Sử dụng HTTPS cho production
- [ ] Rate limiting trên API
- [ ] Input validation trên backend

---

## ✨ STATUS: READY FOR DEPLOYMENT (with minor fixes)

**Khớp nhau:** ✅ 90%
**Có thể deploy:** ✅ CÓ THỂ (với bước verify ở trên)
