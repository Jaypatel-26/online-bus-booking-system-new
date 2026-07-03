import sqlite3
import uuid
import shutil
from datetime import datetime, timezone
from pathlib import Path

META_DB_PATH = Path(__file__).parent / "supabase_meta.db"
PROJECTS_DIR = Path(__file__).parent / "projects"
PROJECTS_DIR.mkdir(exist_ok=True)

def get_meta_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(META_DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_meta_db():
    conn = get_meta_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            api_key TEXT NOT NULL,
            db_file TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()

    # Import existing bus booking DB if projects table is empty
    cursor = conn.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        legacy_db = Path(__file__).parent / "bus_booking.db"
        if legacy_db.exists():
            project_id = str(uuid.uuid4())
            api_key = f"sbp_{uuid.uuid4().hex}"
            now = datetime.now(timezone.utc).isoformat()
            conn.execute(
                "INSERT INTO projects (id, name, api_key, db_file, created_at) VALUES (?, ?, ?, ?, ?)",
                (project_id, "online bus booking system", api_key, "bus_booking.db", now)
            )
            conn.commit()

    conn.close()

def create_project(name: str) -> dict:
    conn = get_meta_connection()
    project_id = str(uuid.uuid4())
    api_key = f"sbp_{uuid.uuid4().hex}"
    now = datetime.now(timezone.utc).isoformat()
    db_file_rel = f"projects/{project_id}.db"
    
    conn.execute(
        "INSERT INTO projects (id, name, api_key, db_file, created_at) VALUES (?, ?, ?, ?, ?)",
        (project_id, name, api_key, db_file_rel, now)
    )
    conn.commit()
    
    # Create the actual SQLite file for the project
    db_path = Path(__file__).parent / db_file_rel
    sqlite3.connect(str(db_path)).close()
    
    row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
    conn.close()
    return dict(row)

def get_all_projects() -> list[dict]:
    conn = get_meta_connection()
    rows = conn.execute("SELECT * FROM projects ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_project_connection(project_id: str) -> sqlite3.Connection:
    conn = get_meta_connection()
    row = conn.execute("SELECT db_file FROM projects WHERE id = ?", (project_id,)).fetchone()
    conn.close()
    
    if not row:
        raise FileNotFoundError(f"Project DB {project_id} not found in meta DB")
        
    db_path = Path(__file__).parent / row["db_file"]
    if not db_path.exists():
        raise FileNotFoundError(f"Database file {db_path} does not exist")
        
    project_conn = sqlite3.connect(str(db_path))
    project_conn.row_factory = sqlite3.Row
    return project_conn
