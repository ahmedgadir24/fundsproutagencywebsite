import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Read .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// We need xlsx package to read the Excel file
import("xlsx").then(async (mod) => {
  const XLSX = mod.default || mod;
  const workbook = XLSX.readFile(resolve(__dirname, "../Fundsprout_Grant_Directory.xlsx"));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  console.log(`Read ${rows.length} grants from Excel`);

  // Clean complexity values
  function cleanComplexity(val) {
    if (!val) return null;
    const v = String(val).trim();
    if (["Simple", "Easy", "Low"].includes(v)) return "Simple";
    if (["Moderate", "Medium"].includes(v)) return "Moderate";
    if (["Complex", "High", "Very High"].includes(v)) return "Complex";
    if (["Yes", "No", "True", "False"].includes(v)) return null;
    return v;
  }

  // Clean LOI values
  function cleanLOI(val) {
    if (val === null || val === undefined || val === "") return null;
    const v = String(val).trim();
    if (v === "true" || v === "True" || v === "Required") return "Yes";
    if (v === "false" || v === "False") return "No";
    return v;
  }

  // Transform rows
  const grants = rows.map((row) => ({
    grant_name: row["Grant Name"] || "Unnamed Grant",
    funding_organization: row["Funding Organization"] || "Unknown",
    description: row["Description"] || null,
    application_url: row["Application URL"] || null,
    amount_min: row["Award Amount Min ($)"] || 0,
    amount_max: row["Award Amount Max ($)"] || 0,
    funding_type: row["Funding Type"] || null,
    application_deadline: row["Application Deadline"] || null,
    grant_cycle: row["Grant Cycle"] || null,
    focus_area: row["Focus Area"] || null,
    geographic_eligibility: row["Geographic Eligibility"] || null,
    eligible_org_types: row["Eligible Org Types"] || null,
    org_budget_requirement: row["Org Budget Requirement"] || null,
    estimated_complexity: cleanComplexity(row["Estimated Complexity"]),
    requires_loi: cleanLOI(row["Requires LOI"]),
    is_active: true,
  }));

  console.log(`Transformed ${grants.length} grants`);
  console.log("Sample:", JSON.stringify(grants[0], null, 2));

  // Insert in batches of 100
  const BATCH = 100;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < grants.length; i += BATCH) {
    const batch = grants.slice(i, i + BATCH);
    const { error } = await supabase.from("gp_grants").insert(batch);
    if (error) {
      console.error(`Batch ${i}-${i + batch.length} error:`, error.message);
      errors++;
    } else {
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${grants.length}`);
    }
  }

  console.log(`\nDone! Inserted ${inserted} grants. Errors: ${errors}`);
}).catch(async (err) => {
  // xlsx not installed, install it first
  if (err.code === "ERR_MODULE_NOT_FOUND") {
    console.log("xlsx package not found. Installing...");
    const { execSync } = await import("child_process");
    execSync("npm install xlsx", { cwd: __dirname, stdio: "inherit" });
    console.log("Installed. Please run the script again:");
    console.log("  node import-grants.mjs");
  } else {
    console.error(err);
  }
});
