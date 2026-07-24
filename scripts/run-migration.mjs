import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(join(__dirname, "..", "supabase", "migrations", "00002_features.sql"), "utf-8")

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || "eexwnwsdehnhclzjjfng"
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

async function run() {
  const res = await fetch(`https://api.supabase.com/platform/projects/${PROJECT_REF}/sql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`Migration failed (${res.status}):`, text)
    process.exit(1)
  }

  console.log("Migration applied successfully!")
}

run().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
