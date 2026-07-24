import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceKey)

async function runSchema() {
  const schemaPath = path.join(process.cwd(), "supabase", "migrations", "00001_initial_schema.sql")
  const sql = fs.readFileSync(schemaPath, "utf-8")

  // Split by statement and execute each
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("--"))

  for (const stmt of statements) {
    const { error } = await supabase.rpc("exec_sql", { query: stmt + ";" })
    if (error) {
      // If rpc doesn't exist, try direct query
      console.error("Error with rpc:", error.message)
    }
  }
}

async function seed() {
  console.log("Running schema...")
  await runSchema()

  // Seed products
  const { data: productsData } = await import("../src/lib/data.js")
  
  // Insert store info
  const { error: storeErr } = await supabase.from("store_info").upsert({
    id: "default",
    name: "MS Computer",
    name_marathi: "एमएस कंप्यूटर",
    tagline: "Premium Custom PC & Laptop Store",
    rating: 5.0,
    review_count: 146,
    address: "Shop No.3, Patil Complex, Wadegao Chowk, Wadegao Naka, Sangola, Maharashtra 413307",
    phone: "087880 28134",
    email: "info@mscomputersangola.in",
    hours: "Open · Closes 9 PM",
    map_link: "https://maps.google.com/?q=C5PW+J8+Sangola+Maharashtra",
    target_audience: "Gamers, Video Editors & AI/LLM Developers",
  })
  if (storeErr) console.error("Store insert error:", storeErr)
  else console.log("Store info seeded")

  console.log("Seed complete!")
}

seed().catch(console.error)
