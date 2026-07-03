// env.js  — Gujarat Bus Seva
// ✅ Python FastAPI Backend (Supabase replaced with local SQLite via FastAPI)

// FastAPI server base URL
const API_BASE = "";

// Razorpay Configuration (public key only — secret is now server-side in Python)
const RAZORPAY_KEY = "rzp_test_T3voI94KAGZsWY";

// ── Compatibility shim (in case any old code references supabaseDb) ──────────
// This prevents runtime errors if any page still loads the old Supabase script.
const supabaseDb = null;
const SUPABASE_URL = "";
const SUPABASE_KEY = "";
