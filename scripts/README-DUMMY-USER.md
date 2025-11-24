# Script Membuat Akun Dummy

Script ini digunakan untuk membuat akun dummy untuk keperluan testing dan development.

## Cara Menggunakan

### 1. Siapkan Environment Variables

Buat file `.env.local` di root project (jika belum ada) dan tambahkan:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Cara mendapatkan Service Role Key:**
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Pergi ke Settings > API
4. Copy "service_role" key (bukan anon key!)

⚠️ **PENTING:** Jangan commit file `.env.local` ke git! File ini sudah seharusnya ada di `.gitignore`.

### 2. Jalankan Script

```bash
npm run create-dummy-user
```

Atau jika ingin set environment variables langsung:

```bash
SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key npm run create-dummy-user
```

## Akun Dummy yang Dibuat

Script akan membuat 5 akun dummy dengan role berbeda:

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | admin123 | Admin |
| gm@test.com | gm123 | GM |
| sales@test.com | sales123 | Sales |
| presales@test.com | presales123 | Presales |
| engineer@test.com | engineer123 | Engineer |

## Catatan

- Script akan skip user yang sudah ada (berdasarkan email)
- Email sudah otomatis dikonfirmasi, jadi bisa langsung login
- Semua user memiliki status aktif
- Jika terjadi error, pastikan Service Role Key sudah benar dan memiliki akses admin

