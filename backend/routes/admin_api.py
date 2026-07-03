from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from backend.meta_db import get_all_projects, create_project, get_project_connection
import sqlite3

router = APIRouter(prefix="/api/admin", tags=["Admin BaaS Full"])

class ProjectCreate(BaseModel):
    name: str

class TableCreate(BaseModel):
    name: str
    columns: list[dict] # {"name": "id", "type": "TEXT PRIMARY KEY"}

# ── Projects ─────────────────────────────────────────────────────────────
@router.get("/projects")
def list_projects():
    return get_all_projects()

@router.post("/projects")
def new_project(project: ProjectCreate):
    return create_project(project.name)

# ── Project Tables ───────────────────────────────────────────────────────
@router.get("/projects/{project_id}/tables")
def get_tables(project_id: str):
    try:
        conn = get_project_connection(project_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Project not found")
        
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        tables = [row["name"] for row in cursor.fetchall()]
        return {"tables": tables}
    finally:
        conn.close()

@router.post("/projects/{project_id}/tables")
def create_table(project_id: str, table: TableCreate):
    try:
        conn = get_project_connection(project_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Project not found")
        
    try:
        cursor = conn.cursor()
        cols = ", ".join([f"{c['name']} {c['type']}" for c in table.columns])
        query = f"CREATE TABLE IF NOT EXISTS {table.name} ({cols})"
        cursor.execute(query)
        conn.commit()
        return {"message": f"Table {table.name} created successfully"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@router.get("/projects/{project_id}/tables/{table_name}/schema")
def get_table_schema(project_id: str, table_name: str):
    conn = get_project_connection(project_id)
    try:
        cursor = conn.cursor()
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        if not columns:
            raise HTTPException(status_code=404, detail="Table not found")
        
        schema = []
        for col in columns:
            schema.append({
                "cid": col["cid"],
                "name": col["name"],
                "type": col["type"],
                "notnull": col["notnull"],
                "dflt_value": col["dflt_value"],
                "pk": col["pk"]
            })
        return {"schema": schema}
    finally:
        conn.close()

@router.get("/projects/{project_id}/tables/{table_name}/rows")
def get_table_rows(project_id: str, table_name: str, limit: int = 100, offset: int = 0):
    conn = get_project_connection(project_id)
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Table not found")
        
        cursor.execute(f"SELECT * FROM {table_name} LIMIT ? OFFSET ?", (limit, offset))
        rows = [dict(row) for row in cursor.fetchall()]
        return rows
    except sqlite3.Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@router.post("/projects/{project_id}/tables/{table_name}/rows")
async def insert_table_row(project_id: str, table_name: str, request: Request):
    data = await request.json()
    if not data:
        raise HTTPException(status_code=400, detail="Empty payload")

    conn = get_project_connection(project_id)
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Table not found")

        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?"] * len(data))
        values = tuple(data.values())

        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        cursor.execute(query, values)
        conn.commit()
        return {"message": "Row inserted", "id": cursor.lastrowid}
    except sqlite3.Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@router.put("/projects/{project_id}/tables/{table_name}/rows/{row_id}")
async def update_table_row(project_id: str, table_name: str, row_id: str, request: Request):
    data = await request.json()
    if not data:
        raise HTTPException(status_code=400, detail="Empty payload")

    conn = get_project_connection(project_id)
    try:
        cursor = conn.cursor()
        cursor.execute(f"PRAGMA table_info({table_name})")
        pk_col = next((row["name"] for row in cursor.fetchall() if row["pk"] == 1), "id")

        set_clause = ", ".join([f"{k} = ?" for k in data.keys()])
        values = tuple(data.values()) + (row_id,)

        query = f"UPDATE {table_name} SET {set_clause} WHERE {pk_col} = ?"
        cursor.execute(query, values)
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Row not found")
        return {"message": "Row updated"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@router.delete("/projects/{project_id}/tables/{table_name}/rows/{row_id}")
def delete_table_row(project_id: str, table_name: str, row_id: str):
    conn = get_project_connection(project_id)
    try:
        cursor = conn.cursor()
        cursor.execute(f"PRAGMA table_info({table_name})")
        pk_col = next((row["name"] for row in cursor.fetchall() if row["pk"] == 1), "id")

        query = f"DELETE FROM {table_name} WHERE {pk_col} = ?"
        cursor.execute(query, (row_id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Row not found")
        return {"message": "Row deleted"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# ── SQL Query Execution ───────────────────────────────────────────────────
class SQLQuery(BaseModel):
    query: str

@router.post("/projects/{project_id}/sql")
async def execute_sql(project_id: str, sql_query: SQLQuery):
    """Execute raw SQL query on project database"""
    try:
        conn = get_project_connection(project_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        cursor = conn.cursor()
        query = sql_query.query.strip()
        
        # Determine if it's a SELECT query or modification
        query_upper = query.upper()
        is_select = query_upper.startswith("SELECT") or query_upper.startswith("PRAGMA")
        
        if is_select:
            cursor.execute(query)
            rows = cursor.fetchall()
            # Convert to list of dicts
            if rows:
                columns = rows[0].keys() if hasattr(rows[0], 'keys') else []
                result = []
                for row in rows:
                    if hasattr(row, 'keys'):
                        result.append(dict(row))
                    else:
                        result.append(dict(zip(columns, row)))
                return result
            return []
        else:
            # For INSERT, UPDATE, DELETE, CREATE, DROP etc.
            cursor.execute(query)
            conn.commit()
            return {"message": f"Query executed successfully. {cursor.rowcount} row(s) affected."}
    except sqlite3.Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
