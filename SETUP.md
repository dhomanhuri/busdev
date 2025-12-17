# Setup Base Project

## Prerequisites

- Node.js 18+ installed
- Supabase account and project

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**How to get Service Role Key:**
1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings > API
4. Copy the "service_role" key (not the anon key!)

⚠️ **IMPORTANT:** Never commit `.env.local` to git! This file should be in `.gitignore`.

**Note:** The `SUPABASE_SERVICE_ROLE_KEY` is required for creating new users via the admin interface. This ensures that creating a new user doesn't change your current session.

### 3. Setup Database

1. Go to your Supabase project SQL Editor
2. Run the script: `scripts/001_create_users_table.sql`
3. This will create:
   - `users` table
   - Triggers for auto-updating `updated_at`
   - Trigger for auto-creating user profile on signup

### 4. Create First Admin User

You can create the first admin user through Supabase Auth dashboard or run this SQL:

```sql
-- Create auth user (you'll need to set password through Supabase Auth dashboard)
-- Then update the role:
UPDATE public.users 
SET role = 'Admin' 
WHERE email = 'admin@example.com';
```

Or use Supabase Auth dashboard to create user and then update role manually.

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and login with your admin credentials.

## Project Structure

```
app/
├── auth/login/          # Login page
├── dashboard/           # Dashboard pages
│   ├── page.tsx        # Dashboard home
│   └── users/          # User management (Admin only)
components/
├── sidebar.tsx         # Sidebar navigation
├── top-nav.tsx         # Top navigation
└── users/              # User management components
lib/
└── supabase/          # Supabase client/server setup
```

## Features

- ✅ Authentication (Login/Logout)
- ✅ User Management (CRUD) - Admin only
- ✅ Role-based access control
- ✅ Dark mode support
- ✅ Responsive design

## Next Steps

This is a minimal base project. You can extend it by adding:
- More pages and features
- Additional database tables
- More role-based permissions
- API routes
- etc.

