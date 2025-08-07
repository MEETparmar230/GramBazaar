# Village Kart - Mini Full-Stack Web App

A simple platform helping rural communities easily find and access essential products like groceries, medicines, and tools.

---

## 🌐 [Live App](https://villagekart.vercel.app)


## Features

- **User Authentication**: Signup and login with secure backend  
- **Product Booking**: Select products and quantities, book them  
- **User Dashboard**: View welcome message, bookings, and edit profile  
- **Dynamic Products List**: Products fetched from backend API  
- **Responsive UI**: Works well on mobile and desktop devices  
- **Homepage Sections**:  
  - Navbar (Logo, Home, Services, Products, Contact)  
  - Our Services (5 service types with icons)  
  - Available Products (6+ products with name, price, icon)  
  - News & Updates (static headlines)  
  - Contact Us (address, helpline, contact form)  

---

## Tech Stack

- **Frontend:** Next.js (React.js) with Tailwind CSS  
- **Backend:** Next.js API Routes (Node.js, Express-like)  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT-based with HttpOnly cookies  
- **API Requests:** Axios  
- **Deployment:** (Add if deployed, e.g., Vercel or Netlify)

---

## Setup and Run Locally

1. Clone the repository  
   ```bash
   git clone https://github.com/yourusername/village-kart.git
   cd village-kart
   ```

2. Install dependencies
  ```bash
   pnpm install
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


## API Endpoints

GET /api/services - List service types

GET /api/products - List available products

POST /api/register - User registration

POST /api/login - User login

GET /api/news - Static news headlines

POST /api/contact - Submit contact form

POST /api/bookings - Create a booking (auth required)

GET /api/bookings - Get user bookings (auth required)

PUT /api/user - Update user profile (auth required)


## License

This project is for educational purposes only.