# 🌿 ND Spices - Pure Heritage Artisanal Spices E-Commerce

![ND Spices Banner](https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80)

**ND Spices** is a full-stack artisanal e-commerce web application celebrating the authentic spice terroir of India. Sourced directly from modern manufacturing facilities and spice farms in Nagaur (Rajasthan) and Western Ghats estates, cold stone-ground at low temperatures and sealed for peak freshness.

---

## ✨ Features & Highlights

- **⚡ Modern Stack**: Built with Next.js 15/16 App Router (Server & Client Components) in strict TypeScript mode.
- **🎨 Artisanal Spice Design System**: Custom Tailwind palette inspired by deep cinnamon (`#7B241C`), cardamom emerald (`#196F3D`), golden turmeric (`#D4AC0D`), and warm cream (`#FDFBF7`).
- **🐘 Serverless Database**: Neon PostgreSQL integration via Prisma ORM with connection pooling for high-concurrency serverless query execution.
- **🛒 Dynamic Cart & Wishlist**: Zustand stores with persistent `localStorage` syncing, live free shipping progress meter, and sliding cart drawer.
- **💳 Payment Gateway Ready**: Pre-configured Razorpay checkout (UPI, Cards, Netbanking) with HMAC-SHA256 signature verification and Cash on Delivery (COD).
- **🔒 Role-Based Authentication**: NextAuth.js (Auth.js) / JWT setup with `USER` and `ADMIN` roles.
- **📧 Transactional Notifications**: Resend email integration for order confirmations and harvest updates.
- **🌱 Seed Catalog**: Comprehensive dataset with authentic Indian spices, multiple weight packages (`100g`, `250g`, `500g`, `1kg`), promotional coupons, and verified buyer reviews.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) App Router (React 19) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + PostCSS + CSS Variables |
| **Database** | [Neon Serverless PostgreSQL](https://neon.tech/) |
| **ORM** | [Prisma ORM](https://www.prisma.io/) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) with persistence |
| **Payment Gateway** | [Razorpay](https://razorpay.com/) + COD |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) / JWT |
| **Form Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Email Service** | [Resend](https://resend.com/) |

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/was24im/ND-Spices.git
cd ND-Spices
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local` and configure your keys:
```bash
cp .env.example .env.local
```

Fill in your Neon Database URLs and secrets:
```env
DATABASE_URL="postgresql://neondb_owner:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your_secret_key"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
```

### 4. Database Setup & Seeding
Push the schema to Neon and seed authentic spice catalog data:
```bash
# Push schema tables & relations
npm run prisma:push

# Seed database with users, spices, variants, and coupons
npm run db:seed
```

### 5. Launch Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth endpoint
│   │   └── products/route.ts            # Neon PostgreSQL live products API
│   ├── products/
│   │   ├── page.tsx                     # Filterable catalog with search & sorting
│   │   └── [slug]/page.tsx              # Product details, weight selection & reviews
│   ├── cart/page.tsx                    # Dedicated basket table & calculations
│   ├── checkout/page.tsx                # Address form & Razorpay/COD flow
│   ├── page.tsx                         # Homepage (Hero, Categories, Bestsellers)
│   ├── layout.tsx                       # Root layout with Navbar, Footer & CartDrawer
│   └── globals.css                      # Spice color variables & glassmorphism
├── components/
│   ├── ui/                              # Button, Badge, Input, Skeleton
│   ├── layout/                          # Navbar, AnnouncementBar, Footer
│   ├── product/                         # ProductCard, ProductGrid, SpiceLevelBadge
│   └── cart/                            # CartDrawer with dynamic shipping meter
├── lib/
│   ├── db.ts                            # PrismaClient singleton for serverless
│   ├── auth.ts                          # NextAuth options & admin credentials
│   ├── razorpay.ts                      # Razorpay client & HMAC verification
│   ├── email.ts                         # Resend order confirmation dispatcher
│   ├── mockData.ts                      # Fallback mock dataset
│   └── utils.ts                         # FormatPrice (INR), cn, discount helper
├── store/
│   ├── useCartStore.ts                  # Persistent Zustand cart store
│   └── useWishlistStore.ts              # Persistent Zustand wishlist store
├── types/
│   └── index.ts                         # TypeScript domain interfaces
└── prisma/
    ├── schema.prisma                    # Neon PostgreSQL models
    └── seed.ts                          # Production database seed script
```

---

## 📜 Available Scripts

- `npm run dev`: Starts local development server with Turbopack.
- `npm run build`: Generates production build with strict type checking.
- `npm run start`: Runs production server.
- `npm run prisma:push`: Synchronizes Prisma schema directly to Neon DB.
- `npm run db:seed`: Populates Neon DB with authentic spice catalog.
- `npm run prisma:studio`: Launches visual Prisma database browser.

---

## 🛡️ License

Private & Proprietary • ND Spices Private Limited.
