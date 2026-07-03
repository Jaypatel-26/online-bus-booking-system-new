"""
FastAPI application entry point.
Run with:  uvicorn backend.main:app --reload --port 8000
"""
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.staticfiles import StaticFiles
# pyrefly: ignore [missing-import]
from fastapi.responses import FileResponse
from pathlib import Path

from backend.database import init_db
from backend.meta_db import init_meta_db
from backend.routes import bookings, payments, tickets, analytics, admin_api

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Gujarat Bus Seva API",
    description="FastAPI backend for the Online Bus Booking System",
    version="2.0.0",
)

# ── CORS (allow browser requests from any origin in dev) ─────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup: initialise database ─────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    init_db()
    init_meta_db()
    print("[OK] Gujarat Bus Seva FastAPI server started!")

# ── API Routers ───────────────────────────────────────────────────────────────
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(tickets.router)
app.include_router(analytics.router)
app.include_router(admin_api.router)

# ── Static file serving (HTML/CSS/JS frontend) ───────────────────────────────
FRONTEND_DIR = Path(__file__).parent.parent  # project root

# Legacy /static mount
app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/health")
def health():
    return {"status": "ok", "message": "Gujarat Bus Seva API is running!"}


# Serve frontend pages directly at their natural URLs
FRONTEND_PAGES = [
    "search", "routes", "seats", "payment",
    "admin", "conductor", "contact", "privacy",
    "terms", "refunds",
]

@app.get("/")
def serve_root():
    # Check if it's an API request
    return FileResponse(str(FRONTEND_DIR / "index.html"))

for _page in FRONTEND_PAGES:
    _html = FRONTEND_DIR / f"{_page}.html"
    if _html.exists():
        # Create a closure to capture the path
        def _make_route(path=_html):
            def _handler():
                return FileResponse(str(path))
            _handler.__name__ = f"serve_{path.stem}"
            return _handler
        app.get(f"/{_page}")(  _make_route())
        app.get(f"/{_page}.html")(_make_route())

# Serve all other static files (like .css, .js) from root
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR)), name="root_static")
