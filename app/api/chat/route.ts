import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DB_DDL = `
-- Table: public.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'GM', 'Sales', 'Presales', 'Engineer', 'Project Manager', 'Marketing')),
  gm_id UUID REFERENCES public.users(id),
  department TEXT,
  status_aktif BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: public.categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: public.sub_categories
CREATE TABLE public.sub_categories (
  id UUID PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  name TEXT NOT NULL,
  description TEXT,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: public.brands
CREATE TABLE public.brands (
  id UUID PRIMARY KEY,
  sub_category_id UUID NOT NULL REFERENCES public.sub_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: public.products
CREATE TABLE public.products (
  id UUID PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brands(id),
  name TEXT NOT NULL,
  description TEXT,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: public.product_executives
CREATE TABLE public.product_executives (
  id UUID PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brands(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: public.projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY,
  nama_proyek TEXT NOT NULL,
  customer_id UUID,
  project_manager_id UUID REFERENCES public.users(id),
  status TEXT,
  nilai_proyek NUMERIC,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Step 1: Ask AI to generate SQL query based on DDL and user question
    const sqlGenerationResponse = await fetch("https://ai.sumopod.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Anda adalah pakar SQL PostgreSQL. Tugas Anda adalah mengubah pertanyaan user menjadi query SQL SELECT yang valid berdasarkan DDL berikut:
            
            ${DB_DDL}
            
            ATURAN:
            1. Hanya berikan query SQL saja, tanpa penjelasan, tanpa markdown code block.
            2. Gunakan JOIN jika diperlukan untuk mendapatkan nama (seperti nama brand, nama user, dll).
            3. Pastikan query aman (hanya SELECT).
            4. Jika pertanyaan tidak bisa dijawab dengan SQL, balas dengan "TIDAK_BISA".`,
          },
          { role: "user", content: lastMessage },
        ],
        max_tokens: 300,
        temperature: 0,
      }),
    });

    const sqlData = await sqlGenerationResponse.json();
    const generatedSql = sqlData.choices[0].message.content.trim();

    let queryResults = null;
    let queryError = null;

    if (generatedSql !== "TIDAK_BISA") {
      // Step 2: Execute the generated SQL via Supabase RPC or direct query
      // Note: Using a generic 'rpc' call to a custom function that can execute dynamic SQL 
      // is the common way if not using a specific library. 
      // For this implementation, we'll use Supabase's query builder if it's simple, 
      // or we can assume a 'execute_sql' RPC exists for more complex dynamic queries.
      
      const supabase = await createClient();
      const { data, error } = await supabase.rpc('execute_sql', { sql_query: generatedSql });
      
      if (!error) {
        queryResults = data;
      } else {
        queryError = error.message;
        console.error("SQL Execution Error:", error);
      }
    }

    // Step 3: Send results back to AI for final summary
    const finalResponse = await fetch("https://ai.sumopod.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Anda adalah asisten AI Business Development. Anda akan diberikan pertanyaan user, query SQL yang dijalankan, dan hasil datanya. Tugas Anda adalah memberikan jawaban yang ramah dan informatif berdasarkan data tersebut.",
          },
          { 
            role: "user", 
            content: `Pertanyaan: ${lastMessage}
            SQL yang dijalankan: ${generatedSql}
            Hasil Data: ${JSON.stringify(queryResults || "Tidak ada data atau terjadi kesalahan")}
            Error (jika ada): ${queryError || "Tidak ada"}` 
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const finalData = await finalResponse.json();
    return NextResponse.json(finalData);
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
