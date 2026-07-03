"""
Analytics routes — summary stats, popular routes, daily revenue, bus performance.
"""
from fastapi import APIRouter
from backend import database as db

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/summary")
def analytics_summary():
    """4 KPI cards: total bookings, total revenue, today's bookings, avg fare."""
    return db.get_analytics_summary()


@router.get("/popular-routes")
def popular_routes(limit: int = 5):
    """Top routes by number of bookings."""
    return db.get_popular_routes(limit)


@router.get("/daily-revenue")
def daily_revenue(days: int = 30):
    """Revenue aggregated by journey_date for last N days."""
    return db.get_daily_revenue(days)


@router.get("/bus-performance")
def bus_performance():
    """Per-bus booking count and total revenue."""
    return db.get_bus_performance()
