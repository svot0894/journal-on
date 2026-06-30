import os
import logging
from dotenv import load_dotenv
from typing import Any, Optional
from supabase import create_client, Client

load_dotenv()

_client: Optional[Client] = None


def get_supabase() -> Client:
    global _client
    if _client is not None:
        return _client
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        logging.warning(
            "Supabase credentials missing; running with empty data."
        )
        return None
    try:
        _client = create_client(url, key)
        return _client
    except Exception as e:
        logging.exception(f"Error: {e}")
        return None