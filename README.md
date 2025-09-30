# 🌾 GramBazaar – Village Kart

GramBazaar (Village Kart) is a Next.js 15 MERN Stack e-commerce platform built as a full-stack project.
It allows users to explore rural products, book and pay securely via Stripe Sandbox, and provides a separate Admin Dashboard for managing the platform.
---

## 🌐 [Live App](https://gram-bazaar.vercel.app/)



## 🚀 Features

- **👥 Authentication**: 
  - User Login & Signup with JWT authentication
  - Secure password hashing using bcryptjs
- **🛒 User Functionality**: 
  - Browse and add products to Cart
  - Stripe Sandbox payment gateway integration
  - Bookings Dashboard:
    - View all bookings (paid & unpaid)
    - Complete pending payments directly
  - Profile Management (edit name, mobile number)
- **📰 Additional Pages**: 
  - Services Page – showcase services offered
  - News Page – updates and announcements
- **🛠️ Admin Functionality**: 
  - Admin Dashboard:
    - Stats: total users, products, bookings, revenue, news
    - Recent activities
    - Pie chart analytics (users, products, bookings)
    - Site settings (update site name & logo)
  - Product / News / Services Management:
    - Add, Edit, Delete
  - Bookings Management:
    - View all bookings
    - Change booking status (Pending/Approved/Rejected)
    - Export bookings as CSV
    - Detailed booking page
  - User Management:
    - Change roles (User ↔ Admin)
    - Delete users
  - Messages Management:
    - View messages from contact form
    - Mark as read / delete single or multiple messages
---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS, ShadCN UI, Redux-Toolkit
- **Backend:** Next.js API Routes (Node.js, Express-like)  
- **Validation:** zod + React Hook Form
- **ImageUpload:** Cloudinary
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT + bcrypt
- **Payments:** Stripe (Sandbox mode)
- **API Requests:** Axios  
- **Deployment:** Vercel
- **Other:** Axios, Date-fns, React Hot Toast

--- 

## login options

```bash
email:user@gmail.com
password:user@123
```

## Payments

```bash
Card Number: 4242 4242 4242 4242
Expiration: Any future date (MM/YY)
CVC: Any 3 digits
ZIP: Any 5 digits
```

## Setup and Run Locally

1. Clone the repository  
```bash
git clone https://github.com/MEETparmar230/GramBazaar
cd village-kart
   ```

2. Install dependencies
```bash
  # with pnpm
pnpm install
pnpm dev

# or with npm
npm install
npm run dev

  ```

3. Create a .env file in the root with the following variables:
```bash
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Run the development server
```bash
pnpm dev
```

5. Open http://localhost:3000 in your browser


## ⚙️ Environment Variables

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## ✅ Future Improvements

- Add product categories & search
- Integrate order tracking
- Dark mode


## 📜 License

This project is for educational purposes only.