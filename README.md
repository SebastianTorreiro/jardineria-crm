# 🌿 Todo Verde CRM

> Enterprise-grade B2B SaaS engineered to digitize operations, inventory, and finances for green-spaces maintenance and pruning enterprises.

## 🏗️ Architecture Overview

Todo Verde CRM is a multi-tenant platform designed to solve real-world operational bottlenecks. It replaces fragmented data silos with a unified dashboard handling client routing, consumable inventory tracking, and profit distribution.

### Tech Stack
* **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, Lucide Icons.
* **Backend:** Supabase (PostgreSQL), Next.js Server Actions.
* **Database & Security:** Strict Row Level Security (RLS) policies for multi-tenant data isolation.
* **Type Safety:** TypeScript end-to-end, leveraging Supabase database types.

## 🚀 Key Features

* **Client & Visit Routing:** Full CRUD for client management and visit scheduling.
* **Inventory Management:** Real-time tracking of heavy tools and consumable supplies.
* **Financial Engine:** Automated profit tracking, expense logging, and team distribution calculations.
* **Role-Based Access:** Secure authentication flows mapping users to their specific operational data.

## 💻 Local Setup & Development

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/SebastianTorreiro/jardineria-crm.git](https://github.com/SebastianTorreiro/jardineria-crm.git)
   cd jardineria-crm
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧠 Database Schema (Supabase)
The system relies on a heavily normalized PostgreSQL schema (`schema.sql`). Key tables include:
* `clients`, `properties`, `visits`
* `finances_expenses`, `finances_profit_distribution`
* `inventory_tools`, `inventory_supplies`

*(Note: Ensure Supabase migrations/schema are applied to your linked project before local testing).*
