/**
 * Run with: npx tsx scripts/seed-admin.ts
 * Seeds the admin user from ADMIN_EMAIL and ADMIN_PASSWORD env vars.
 */
import "dotenv/config";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const BASE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

async function seed() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
    process.exit(1);
  }

  const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: "Admin",
    }),
  });

  const data = await res.json();

  if (res.ok) {
    console.log("Admin user created:", ADMIN_EMAIL);
  } else if (data.message?.includes("already") || res.status === 422) {
    console.log("Admin user already exists:", ADMIN_EMAIL);
  } else {
    console.error("Failed to seed admin:", data);
    process.exit(1);
  }
}

seed();
