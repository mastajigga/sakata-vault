import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  try {
    console.log("🔧 Running migration: add-hero-video-url-column.sql\n");

    // Read the migration file
    const migrationPath = join(
      __dirname,
      "add-hero-video-url-column.sql"
    );
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    // Execute the migration
    const { error } = await supabase.rpc("exec", {
      sql: migrationSQL,
    } as any);

    if (error) {
      console.error("❌ Migration failed:", error);
      // Try alternative approach: split by statements
      const statements = migrationSQL
        .split(";")
        .filter((s) => s.trim().length > 0);

      for (const statement of statements) {
        console.log(`\nExecuting: ${statement.substring(0, 80)}...`);
        const { error: stmtError } = await supabase.rpc("exec", {
          sql: statement + ";",
        } as any);

        if (stmtError) {
          console.log(`⚠️  Statement error: ${stmtError.message}`);
          // Continue with next statement
        } else {
          console.log("✅ Statement executed");
        }
      }
    } else {
      console.log("✅ Migration completed successfully!");
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    process.exit(1);
  }
}

runMigration();
