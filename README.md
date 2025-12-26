# Business Development Management System

Sistem manajemen pengembangan bisnis lengkap dengan fitur manajemen master data, proyek, pelanggan, dan dashboard analytics menggunakan Next.js dan Supabase.

## Fitur Utama

### 🔐 Authentication & Authorization
- ✅ Authentication (Login/Logout)
- ✅ User Management (CRUD) - Admin only
- ✅ Role-based access control
- ✅ Profile management dengan avatar upload

### 📊 Dashboard & Analytics
- ✅ Dashboard dengan statistik real-time
- ✅ Charts dan grafik proyek
- ✅ Recent projects overview
- ✅ Top customers analytics
- ✅ Draggable dashboard widgets

### 🏢 Master Data Management
- ✅ **Brands** - Manajemen brand/perusahaan
- ✅ **Categories & Sub-categories** - Kategori produk dan sub-kategori
- ✅ **Products** - Manajemen produk dengan SKU dan harga
- ✅ **Customers** - Database pelanggan
- ✅ **Distributors** - Manajemen distributor
- ✅ **Partnerships** - Manajemen kemitraan
- ✅ **Project Types** - Tipe proyek
- ✅ **Certificates** - Sertifikasi dan lisensi
- ✅ **Readiness** - Status kesiapan

### 📋 Project Management
- ✅ Project CRUD operations
- ✅ Project details dengan deskripsi, nilai, dan periode
- ✅ Assignment project manager
- ✅ Project products dengan distributor tracking

### 🎨 User Experience
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Modern UI dengan shadcn/ui components
- ✅ Drag & drop functionality
- 


## Tech Stack
- **Framework**: Next.js 16
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database

Jalankan script SQL berikut di Supabase SQL Editor secara berurutan:

#### Core Tables
- `scripts/001_create_users_table.sql` - Tabel users dan auth triggers
- `scripts/002_create_master_tables.sql` - Tabel master (brands, categories, products, dll)

#### Database Updates
- `scripts/003_remove_product_sku_price.sql` - Update struktur produk
- `scripts/004_add_project_manager_role.sql` - Tambah role project manager

#### Additional Tables
- `scripts/005_create_partnerships_table.sql` - Tabel partnerships
- `scripts/006_remove_partnership_contact_fields.sql` - Update partnerships
- `scripts/007_create_readiness_table.sql` - Tabel readiness status
- `scripts/008_create_certificates_table.sql` - Tabel certificates
- `scripts/009_create_distributors_table.sql` - Tabel distributors
- `scripts/010_create_customers_table.sql` - Tabel customers

#### Projects Module
- `scripts/011_create_projects_table.sql` - Tabel projects
- `scripts/012_add_project_description_and_manager.sql` - Update projects
- `scripts/013_make_pid_nullable.sql` - Update project structure
- `scripts/014_add_project_value_and_period.sql` - Tambah nilai dan periode proyek
- `scripts/015_add_distributor_to_project_products.sql` - Update project products
- `scripts/016_create_project_types_table.sql` - Tabel project types
- `scripts/017_add_project_type_to_project_products.sql` - Update project products

#### Storage
- `scripts/016_create_avatars_storage_bucket.sql` - Storage bucket untuk avatar

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Struktur Proyek

```
busdev/
├── app/
│   ├── api/
│   │   └── users/
│   │       └── create/
│   │           └── route.ts      # API route untuk create user
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx          # Halaman login
│   ├── dashboard/
│   │   ├── brands/               # Manajemen brand
│   │   ├── categories/           # Manajemen kategori
│   │   ├── certificates/         # Manajemen sertifikat
│   │   ├── customers/            # Manajemen pelanggan
│   │   ├── distributors/         # Manajemen distributor
│   │   ├── layout.tsx            # Layout dashboard
│   │   ├── page.tsx              # Dashboard utama
│   │   ├── partnerships/         # Manajemen kemitraan
│   │   ├── products/             # Manajemen produk
│   │   ├── profile/              # Pengaturan profil
│   │   ├── project-types/        # Tipe proyek
│   │   ├── projects/             # Manajemen proyek
│   │   ├── readiness/            # Status kesiapan
│   │   ├── sub-categories/       # Sub-kategori
│   │   └── users/                # Manajemen user
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── dashboard/                # Komponen dashboard
│   │   ├── dashboard-content.tsx
│   │   ├── draggable-dashboard.tsx
│   │   ├── projects-chart.tsx
│   │   ├── recent-projects.tsx
│   │   ├── stats-card.tsx
│   │   └── top-customers.tsx
│   ├── master/                   # Komponen master data
│   │   ├── brand-dialog.tsx
│   │   ├── brands-list.tsx
│   │   ├── categories-list.tsx
│   │   ├── category-dialog.tsx
│   │   ├── certificate-dialog.tsx
│   │   ├── certificates-list.tsx
│   │   ├── customer-dialog.tsx
│   │   ├── customers-list.tsx
│   │   ├── distributor-dialog.tsx
│   │   ├── distributors-list.tsx
│   │   ├── partnership-dialog.tsx
│   │   ├── partnerships-list.tsx
│   │   ├── product-dialog.tsx
│   │   ├── products-list.tsx
│   │   ├── project-type-dialog.tsx
│   │   ├── project-types-list.tsx
│   │   ├── readiness-dialog.tsx
│   │   ├── readiness-list.tsx
│   │   ├── sub-categories-list.tsx
│   │   └── sub-category-dialog.tsx
│   ├── profile/
│   │   └── profile-settings.tsx   # Pengaturan profil
│   ├── projects/                 # Komponen proyek
│   │   ├── project-detail-dialog.tsx
│   │   ├── project-dialog.tsx
│   │   └── projects-list.tsx
│   ├── sidebar.tsx               # Sidebar navigasi
│   ├── theme-provider.tsx        # Theme provider
│   ├── theme-toggle.tsx          # Toggle dark/light mode
│   ├── top-nav.tsx               # Top navigation
│   ├── ui/                       # UI components (shadcn/ui)
│   └── users/                    # Komponen user management
│       ├── user-dialog.tsx
│       └── users-list.tsx
├── lib/
│   ├── supabase/                 # Setup Supabase
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   └── utils.ts                  # Utility functions
├── scripts/                      # SQL scripts & setup
├── public/                       # Static assets
└── package.json, etc.            # Config files
```

## User Roles

- **Admin**: Full access, dapat manage users
- **GM**: General Manager (read-only untuk user management)
- **Sales**: Sales user (read-only)
- **Presales**: Presales user (read-only)
- **Engineer**: Engineer user (read-only)

## Authorization Matrix

Tabel berikut menunjukkan level akses untuk setiap role terhadap berbagai modul sistem:

| Modul/Fitur | Admin | GM | Sales | Presales | Engineer | Project Manager |
|-------------|-------|----|-------|----------|----------|-----------------|
| **Authentication & User Management** | | | | | | |
| Login/Logout | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Profile Management | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| User Management (CRUD) | ✅ Full | 🔒 None | 🔒 None | 🔒 None | 🔒 None | 🔒 None |
| Role Assignment | ✅ Full | 🔒 None | 🔒 None | 🔒 None | 🔒 None | 🔒 None |

| Modul/Fitur | Admin | GM | Sales | Presales | Engineer | Project Manager |
|-------------|-------|----|-------|----------|----------|-----------------|
| **Dashboard & Analytics** | | | | | | |
| Dashboard Overview | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Statistics Cards | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Projects Chart | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Recent Projects | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Top Customers | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |

| Modul/Fitur | Admin | GM | Sales | Presales | Engineer | Project Manager |
|-------------|-------|----|-------|----------|----------|-----------------|
| **Master Data Management** | | | | | | |
| Brands | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Categories & Sub-categories | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Products | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Customers | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Distributors | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Partnerships | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Project Types | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Certificates | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Readiness | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |

| Modul/Fitur | Admin | GM | Sales | Presales | Engineer | Project Manager |
|-------------|-------|----|-------|----------|----------|-----------------|
| **Project Management** | | | | | | |
| Project List View | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| Project Details | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Full |
| Create Project | ✅ Full | 🔒 None | 🔒 None | 🔒 None | 🔒 None | ✅ Full |
| Edit Project | ✅ Full | 🔒 None | 🔒 None | 🔒 None | 🔒 None | ✅ Full |
| Delete Project | ✅ Full | 🔒 None | 🔒 None | 🔒 None | 🔒 None | 🔒 None |
| Assign Project Manager | ✅ Full | 🔒 None | 🔒 None | 🔒 None | 🔒 None | 🔒 None |
| Project Products | ✅ Full | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Full |

### Legend:
- ✅ **Full Access**: Read, Create, Update, Delete
- 🔒 **No Access**: Tidak ada akses
- **Read**: Hanya dapat melihat data

### Permission Levels:
- **Admin**: Akses penuh ke semua fitur dan data
- **GM**: Akses read-only ke semua modul kecuali user management
- **Sales/Presales/Engineer**: Akses read-only ke semua modul
- **Project Manager**: Akses read ke semua modul, akses full ke project management

## Modul Bisnis

### 🏢 Master Data Management
Sistem ini menyediakan modul komprehensif untuk mengelola data master perusahaan:

- **Brands**: Database brand/perusahaan yang dikelola
- **Categories & Sub-categories**: Hierarki kategori produk untuk organisasi yang lebih baik
- **Products**: Katalog produk dengan informasi SKU, harga, dan spesifikasi
- **Customers**: Database pelanggan dengan informasi kontak dan detail bisnis
- **Distributors**: Manajemen distributor dan channel distribusi
- **Partnerships**: Tracking kemitraan strategis dan kolaborasi
- **Project Types**: Klasifikasi berbagai jenis proyek yang ditangani
- **Certificates**: Manajemen sertifikasi, lisensi, dan kredensial
- **Readiness**: Status kesiapan untuk berbagai aspek bisnis

### 📋 Project Management
Modul terintegrasi untuk manajemen proyek end-to-end:

- **Project CRUD**: Operasi lengkap untuk membuat, membaca, memperbarui, dan menghapus proyek
- **Project Details**: Informasi komprehensif termasuk deskripsi, nilai proyek, dan periode
- **Project Manager Assignment**: Penugasan manager untuk setiap proyek
- **Project Products**: Tracking produk yang digunakan dalam proyek dengan informasi distributor

### 📊 Dashboard & Analytics
Dashboard interaktif dengan visualisasi data real-time:

- **Statistics Cards**: Metrik utama bisnis dalam format kartu
- **Projects Chart**: Visualisasi status dan progress proyek
- **Recent Projects**: Overview proyek terbaru
- **Top Customers**: Analisis pelanggan teratas berdasarkan berbagai kriteria
- **Draggable Widgets**: Dashboard yang dapat dikustomisasi dengan drag & drop

## Setup Instructions

Lihat `SETUP.md` untuk instruksi setup lengkap.

## Copy Files

Lihat `COPY_FILES.md` untuk daftar file yang perlu di-copy dari project utama.

## License

MIT

