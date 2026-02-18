import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

# Load .env file
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
print(f"Supabase URL: {SUPABASE_URL}")
print(f"Supabase Anon Key: {SUPABASE_ANON_KEY}")
if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("Supabase credentials are not set in environment variables.")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
