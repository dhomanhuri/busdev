#!/bin/bash

# --- KONFIGURASI API ---
# URL menargetkan tabel 'brands'
URL="https://lwqyyoqvzajtqtscqnzu.supabase.co/rest/v1/brands?select=*"
# Token dan API Key yang Anda berikan
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3cXl5b3F2emFqdHF0c2Nxbnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NzY4NTcsImV4cCI6MjA3OTU1Mjg1N30.12TaSL-igz_Lera0juIDZsKNFxcpxNWy3EbtbaCSLxo"
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsImtpZCI6IndoaEZjdlBJRi9KbEcwbVkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2x3cXl5b3F2emFqdHF0c2Nxbnp1LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2NjYwZDBhMS1iMzQ3LTQxMzMtOTU4OS03MGM1MTM5MGY1ODIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY0MjUwODY5LCJpYXQiOjE3NjQyNDcyNjksImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1hX2xlbmdrYXAiOiJBZG1pbiBEdW1teSIsInJvbGUiOiJBZG1pbiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzY0MjQ3MjY5fV0sInNlc3Npb25faWQiOiI3YWFlMmRiMC00MzAyLTRhYTEtOTIzOC0wYjA5NzY3NGM5MGMiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.bp8jmvC4zz-IYo9h9UpV-KJKX1pzVd-HzPILFoqhQgc"

# ID Sub-Kategori yang diambil dari payload CURL Anda
# ID ini akan diterapkan ke semua merek di bawah.
SUB_CATEGORY_ID="4952ab6c-6ed9-4a10-84a9-f491d17de374"

# --- LOOP DATA ---
# Format Data: NAMA_BRAND | DESKRIPSI
while IFS="|" read -r B_NAME B_DESC || [ -n "$B_NAME" ]; do
  # Skip baris kosong atau komentar
  [[ "$B_NAME" =~ ^#.*$ ]] && continue
  [ -z "$B_NAME" ] && continue

  echo "Mengirim Brand: $B_NAME..."

  # Kirim Request CURL
  curl --location --silent --output /dev/null --show-error --fail "$URL" \
  --header 'accept: application/vnd.pgrst.object+json' \
  --header 'accept-language: en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7' \
  --header "apikey: $API_KEY" \
  --header "authorization: Bearer $AUTH_TOKEN" \
  --header 'content-profile: public' \
  --header 'content-type: application/json' \
  --header 'prefer: return=representation' \
  --data-raw "$(cat <<EOF
{
  "sub_category_id": "$SUB_CATEGORY_ID",
  "name": "$B_NAME",
  "description": "$B_DESC",
  "status_aktif": true
}
EOF
)"

  # Cek status exit dari command curl terakhir
  if [ $? -eq 0 ]; then
    echo "✅ Sukses: $B_NAME"
  else
    echo "❌ Gagal: $B_NAME"
  fi
  
  # Jeda sebentar untuk menghindari rate limiting
  sleep 0.2

done <<DATA_INPUT
Palo Alto Networks|Penyedia keamanan jaringan dan cloud terkemuka, terkenal dengan Next-Generation Firewall.
Fortinet|Solusi keamanan siber yang komprehensif, mencakup firewall, endpoint, dan security fabric.
CrowdStrike|Platform proteksi endpoint, cloud, dan intelijen ancaman berbasis AI/cloud.
Sophos|Solusi keamanan endpoint, enkripsi, dan Unified Threat Management (UTM).
Vicarius|Platform manajemen risiko dan kerentanan berbasis AI.
Menlo|Spesialis keamanan akses internet dan isolasi web (Web Isolation).
Kaspersky|Perusahaan keamanan siber global yang menyediakan solusi antivirus dan perlindungan endpoint.
DATA_INPUT

echo "--- Selesai Memasukkan Semua Data Brands Baru ---"