"""
Booking routes — save, fetch, delete, seat availability.
"""
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException
from backend.models import BookingCreate, BookingResponse
from backend import database as db

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("", response_model=BookingResponse, status_code=201)
def create_booking(payload: BookingCreate):
    """Save a new confirmed booking to SQLite."""
    # Prevent duplicate PNR
    existing = db.get_booking_by_pnr(payload.pnr)
    if existing:
        raise HTTPException(status_code=409, detail="PNR already exists")
    saved = db.insert_booking(payload.model_dump())
    return saved


@router.get("", response_model=list[BookingResponse])
def list_bookings():
    """Return all bookings (for admin portal)."""
    return db.get_all_bookings()


@router.get("/{pnr}", response_model=BookingResponse)
def get_booking(pnr: str):
    """Fetch a single booking by PNR."""
    booking = db.get_booking_by_pnr(pnr)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.delete("/{pnr}", status_code=200)
def delete_booking(pnr: str):
    """Delete a booking by PNR (admin use)."""
    deleted = db.delete_booking_by_pnr(pnr)
    if not deleted:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": f"Booking {pnr} deleted successfully"}


@router.get("/seats/{bus_id}/{journey_date}")
def get_booked_seats(bus_id: str, journey_date: str):
    """Return list of already-booked seat labels for a bus + date."""
    seats = db.get_booked_seats(bus_id, journey_date)
    return {"booked_seats": seats}
