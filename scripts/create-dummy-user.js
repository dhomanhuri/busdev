/**
 * Script untuk membuat akun dummy untuk testing
 * 
 * Usage:
 *   SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key npm run create-dummy-user
 * 
 * Atau set environment variables di terminal sebelum menjalankan:
 *   export SUPABASE_URL=your_url
 *   export SUPABASE_SERVICE_ROLE_KEY=your_key
 *   npm run create-dummy-user
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Try to load .env or .env.local if exists
const envPaths = ['.env', '.env.local'].map(f => path.join(process.cwd(), f));
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diset!');
  console.error('\nCara penggunaan:');
  console.error('  1. Buat file .env.local di root project');
  console.error('  2. Tambahkan:');
  console.error('     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.error('  3. Jalankan: node scripts/create-dummy-user.js');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Data akun dummy
const dummyUsers = [
  {
    email: 'admin@test.com',
    password: 'admin123',
    nama_lengkap: 'Admin Dummy',
    role: 'Admin'
  },
  {
    email: 'gm@test.com',
    password: 'gm123',
    nama_lengkap: 'GM Dummy',
    role: 'GM'
  },
  {
    email: 'sales@test.com',
    password: 'sales123',
    nama_lengkap: 'Sales Dummy',
    role: 'Sales'
  },
  {
    email: 'presales@test.com',
    password: 'presales123',
    nama_lengkap: 'Presales Dummy',
    role: 'Presales'
  },
  {
    email: 'engineer@test.com',
    password: 'engineer123',
    nama_lengkap: 'Engineer Dummy',
    role: 'Engineer'
  }
];

async function createDummyUsers() {
  console.log('🚀 Membuat akun dummy...\n');

  // Get list of existing users to check duplicates
  let existingEmails = new Set();
  try {
    const { data: { users } } = await supabase.auth.admin.listUsers();
    if (users) {
      existingEmails = new Set(users.map(u => u.email?.toLowerCase()));
    }
  } catch (error) {
    console.log('⚠️  Tidak bisa fetch existing users, akan lanjut create...\n');
  }

  for (const user of dummyUsers) {
    try {
      // Check if user already exists
      if (existingEmails.has(user.email.toLowerCase())) {
        console.log(`⚠️  User ${user.email} sudah ada, skip...`);
        continue;
      }

      // Create user in auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto confirm email
        user_metadata: {
          nama_lengkap: user.nama_lengkap,
          role: user.role
        }
      });

      if (authError) {
        // If user already exists (error code 422 or message contains "already"), skip
        if (authError.message?.toLowerCase().includes('already') || 
            authError.message?.toLowerCase().includes('exists') ||
            authError.status === 422) {
          console.log(`⚠️  User ${user.email} sudah ada, skip...`);
          continue;
        }
        console.error(`❌ Error membuat user ${user.email}:`, authError.message);
        continue;
      }

      // Update user profile in public.users table
      // Trigger should handle this, but we'll update it manually to ensure role is set correctly
      const { error: profileError } = await supabase
        .from('users')
        .update({
          nama_lengkap: user.nama_lengkap,
          role: user.role,
          status_aktif: true
        })
        .eq('id', authUser.user.id);

      if (profileError) {
        console.error(`⚠️  Warning: Error update profile ${user.email}:`, profileError.message);
      }

      console.log(`✅ Berhasil membuat user: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Nama: ${user.nama_lengkap}\n`);

    } catch (error) {
      console.error(`❌ Error membuat user ${user.email}:`, error.message);
    }
  }

  console.log('\n✨ Selesai! Akun dummy sudah dibuat.');
  console.log('\n📝 Daftar akun dummy:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  dummyUsers.forEach(user => {
    console.log(`Email: ${user.email.padEnd(25)} | Password: ${user.password.padEnd(15)} | Role: ${user.role}`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

createDummyUsers().catch(console.error);

