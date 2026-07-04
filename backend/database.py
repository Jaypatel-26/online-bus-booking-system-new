"""
SQLite database setup and CRUD helper functions.
"""
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

import os

# Railway persistent volume support
RAILWAY_VOLUME = os.getenv("RAILWAY_VOLUME_MOUNT_PATH")
if RAILWAY_VOLUME:
    DB_PATH = Path(RAILWAY_VOLUME) / "bus_booking.db"
else:
    DB_PATH = Path(__file__).parent / "bus_booking.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row  # return dict-like rows
    # Changed from WAL to DELETE so data writes directly to the .db file
    # This ensures downloaded .db files from Railway have the latest data
    conn.execute("PRAGMA journal_mode=DELETE")
    return conn


def init_db():
    """Create tables if they don't exist."""
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id          TEXT PRIMARY KEY,
            pnr         TEXT UNIQUE NOT NULL,
            passenger_name TEXT NOT NULL,
            mobile      TEXT NOT NULL,
            email       TEXT NOT NULL,
            bus_id      TEXT NOT NULL,
            bus_name    TEXT NOT NULL,
            journey_date TEXT NOT NULL,
            source      TEXT NOT NULL,
            destination TEXT NOT NULL,
            boarding_point TEXT NOT NULL,
            seats       TEXT NOT NULL,
            base_fare   TEXT NOT NULL,
            concession  TEXT NOT NULL,
            service_fee TEXT NOT NULL,
            amount      TEXT NOT NULL,
            created_at  TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()
    print("[OK] Database initialised at", DB_PATH)


# ── CRUD ──────────────────────────────────────────────────────────────────────

def insert_booking(data: dict) -> dict:
    """Insert a new booking. Returns the saved row."""
    conn = get_connection()
    now = datetime.now(timezone.utc).isoformat()
    row_id = str(uuid.uuid4())
    conn.execute("""
        INSERT INTO bookings
            (id, pnr, passenger_name, mobile, email, bus_id, bus_name,
             journey_date, source, destination, boarding_point, seats,
             base_fare, concession, service_fee, amount, created_at)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        row_id,
        data["pnr"], data["passenger_name"], data["mobile"], data["email"],
        data["bus_id"], data["bus_name"], data["journey_date"],
        data["source"], data["destination"], data["boarding_point"],
        data["seats"], data["base_fare"], data["concession"],
        data["service_fee"], data["amount"], now
    ))
    conn.commit()
    row = conn.execute("SELECT * FROM bookings WHERE id = ?", (row_id,)).fetchone()
    conn.close()
    return dict(row)


def get_all_bookings() -> list[dict]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM bookings ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_booking_by_pnr(pnr: str) -> dict | None:
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM bookings WHERE pnr = ?", (pnr,)
    ).fetchone()
    return dict(row) if row else None


def get_bookings_by_user(mobile: str, email: str) -> list[dict]:
    """Fetch all bookings for a user by mobile and email, sorted by journey_date."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM bookings WHERE mobile = ? AND email = ? ORDER BY journey_date DESC",
        (mobile, email)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def delete_booking_by_pnr(pnr: str) -> bool:
    """Delete a booking by PNR. Returns True if deleted, False if not found."""
    conn = get_connection()
    cursor = conn.execute("DELETE FROM bookings WHERE pnr = ?", (pnr,))
    conn.commit()
    conn.close()
    return cursor.rowcount > 0


def get_booked_seats(bus_id: str, journey_date: str) -> list[str]:
    """Return a flat list of all seat labels booked for a bus on a date."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT seats FROM bookings WHERE bus_id = ? AND journey_date = ?",
        (bus_id, journey_date)
    ).fetchall()
    conn.close()
    all_seats: list[str] = []
    for r in rows:
        # seats stored as comma-separated, e.g. "A1,A2,B3"
        all_seats.extend([s.strip() for s in r["seats"].split(",") if s.strip()])
    return all_seats


# ── Analytics ─────────────────────────────────────────────────────────────────

def get_analytics_summary() -> dict:
    conn = get_connection()
    total_bookings = conn.execute("SELECT COUNT(*) FROM bookings").fetchone()[0]

    # Revenue: amount column like "Rs. 1,200" → strip and parse
    amounts = conn.execute("SELECT amount FROM bookings").fetchall()
    total_revenue = 0
    for (amt,) in amounts:
        try:
            cleaned = amt.replace("Rs.", "").replace(",", "").strip()
            total_revenue += float(cleaned)
        except Exception:
            pass

    today = datetime.now().strftime("%Y-%m-%d")
    today_bookings = conn.execute(
        "SELECT COUNT(*) FROM bookings WHERE journey_date = ?", (today,)
    ).fetchone()[0]

    avg_fare = round(total_revenue / total_bookings, 2) if total_bookings > 0 else 0

    conn.close()
    return {
        "total_bookings": total_bookings,
        "total_revenue": total_revenue,
        "today_bookings": today_bookings,
        "avg_fare": avg_fare,
    }


def get_popular_routes(limit: int = 5) -> list[dict]:
    conn = get_connection()
    rows = conn.execute("""
        SELECT source || ' → ' || destination AS route,
               COUNT(*) AS count
        FROM bookings
        GROUP BY source, destination
        ORDER BY count DESC
        LIMIT ?
    """, (limit,)).fetchall()
    conn.close()
    return [{"route": r["route"], "count": r["count"]} for r in rows]


def get_daily_revenue(days: int = 30) -> list[dict]:
    conn = get_connection()
    rows = conn.execute("""
        SELECT journey_date AS date, amount
        FROM bookings
        ORDER BY created_at DESC
    """).fetchall()
    conn.close()

    # Aggregate by date
    from collections import defaultdict
    daily: dict[str, float] = defaultdict(float)
    for r in rows:
        try:
            cleaned = r["amount"].replace("Rs.", "").replace(",", "").strip()
            daily[r["date"]] += float(cleaned)
        except Exception:
            pass

    sorted_days = sorted(daily.items())[-days:]
    return [{"date": d, "revenue": round(v, 2)} for d, v in sorted_days]


def get_bus_performance() -> list[dict]:
    conn = get_connection()
    rows = conn.execute("""
        SELECT bus_name,
               COUNT(*) AS bookings,
               SUM(CAST(REPLACE(REPLACE(amount,'Rs.',''),',','') AS REAL)) AS revenue
        FROM bookings
        GROUP BY bus_name
        ORDER BY bookings DESC
    """).fetchall()
    conn.close()
    result = []
    for r in rows:
        result.append({
            "bus_name": r["bus_name"],
            "bookings": r["bookings"],
            "revenue": round(r["revenue"] or 0, 2),
        })
    return result
