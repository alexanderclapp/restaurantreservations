# User Authentication & Database Setup

## ✅ What's Been Implemented

### 1. **PostgreSQL Database**
- ✅ Heroku Postgres addon installed (`essential-0` tier)
- ✅ Two tables created:
  - **`users`**: Stores user accounts (email, name, phone, hashed password)
  - **`reservations`**: Stores booking history (linked to users, includes Vapi call IDs)

### 2. **User Authentication (NextAuth)**
- ✅ Email/password authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Session management with JWT tokens
- ✅ Login page: `/login`
- ✅ Signup page: `/signup`
- ✅ Auto-login after signup

### 3. **User Dashboard**
- ✅ View all reservations: `/dashboard`
- ✅ Shows reservation details (restaurant, date, time, party size, status)
- ✅ Status badges (pending, confirmed, cancelled)
- ✅ Beautiful, responsive design

### 4. **Updated Booking Flow**
- ✅ Logged-in users: Reservations automatically saved to database
- ✅ Guest users: Can still book (reservation not saved)
- ✅ Each booking includes Vapi call ID for tracking

### 5. **Navigation Header**
- ✅ Shows login/signup buttons for guests
- ✅ Shows user name and logout button for authenticated users
- ✅ "My Reservations" link to dashboard

---

## 🔐 Environment Variables

### Local (`.env.local`)
```bash
DATABASE_URL=postgres://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=d781e293e28ecec4981f800c8f3c7c1718c4c11e2b28d2df5a66697393099b90
```

### Heroku (Already Configured)
```bash
DATABASE_URL=<auto-set by Heroku Postgres>
NEXTAUTH_URL=https://restaurantreservations-madrid-3f372df78bba.herokuapp.com
NEXTAUTH_SECRET=d781e293e28ecec4981f800c8f3c7c1718c4c11e2b28d2df5a66697393099b90
npm_config_legacy_peer_deps=true
```

---

## 🚀 How to Test

### 1. **Create an Account**
1. Go to: https://restaurantreservations-madrid-3f372df78bba.herokuapp.com
2. Click "Sign Up"
3. Fill in your details and create an account
4. You'll be automatically logged in

### 2. **Make a Reservation**
1. Browse restaurants on the homepage
2. Click "Reserve Table" on any restaurant
3. Fill in the booking form
4. Submit → Vapi will call the restaurant
5. Your reservation is saved to the database!

### 3. **View Your Reservations**
1. Click "My Reservations" in the header
2. See all your bookings with status, date, time, etc.

### 4. **Log Out and Log Back In**
1. Click "Sign Out"
2. Click "Sign In"
3. Enter your credentials
4. Your reservations are still there!

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reservations Table
```sql
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  restaurant_name VARCHAR(255) NOT NULL,
  restaurant_phone VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  party_size INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',  -- pending, confirmed, cancelled
  vapi_call_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Useful Commands

### Check Database Tables (Heroku)
```bash
heroku pg:psql
\dt          # List all tables
\d users     # Describe users table
\d reservations  # Describe reservations table
SELECT * FROM users;  # View all users
SELECT * FROM reservations;  # View all reservations
\q           # Exit
```

### Reset Database (if needed)
```bash
node scripts/init-db.js
```

### View Heroku Logs
```bash
heroku logs --tail
```

---

## 🎨 Pages & Routes

### Frontend Pages
- `/` - Homepage (restaurant grid)
- `/login` - User login
- `/signup` - User signup
- `/dashboard` - User reservations

### API Routes
- `POST /api/auth/signup` - Create account
- `POST /api/auth/[...nextauth]` - NextAuth login/logout
- `POST /api/book` - Create reservation + Vapi call
- `GET /api/reservations` - Fetch user's reservations
- `POST /api/vapi-webhook` - Handle Vapi callbacks

---

## 🎉 What's Next?

You can now extend this with:
1. **Cancel/Modify Reservations**: Add buttons in the dashboard
2. **Email Notifications**: Send confirmation emails to users
3. **Admin Dashboard**: View all reservations across all users
4. **Reservation Status Updates**: Update status when Vapi calls complete
5. **User Profile Page**: Allow users to edit their info
6. **Restaurant Reviews**: Let users review restaurants after dining

---

## 📝 Notes

- Guest users can still make reservations, but they won't be saved to the database
- Logged-in users automatically have reservations saved
- The Vapi webhook can update reservation status in the future
- Password reset functionality can be added with NextAuth email provider

---

**Deployed URL**: https://restaurantreservations-madrid-3f372df78bba.herokuapp.com

Enjoy your new authenticated restaurant booking system! 🎊
