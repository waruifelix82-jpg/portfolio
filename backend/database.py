import os
import sqlite3


try:
    import psycopg2
    import psycopg2.extras
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

DATABASE_URL = os.environ.get('postgresql://postgres:[YOUR-PASSWORD]@db.aglcgzllholsxacnfplo.supabase.co:5432/postgres')

def get_db():
    if DATABASE_URL and HAS_POSTGRES:
        # Handle Render/Supabase connection string prefix format if needed
        db_url = DATABASE_URL
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        
        # Connect to PostgreSQL / Supabase
        conn = psycopg2.connect(db_url, cursor_factory=psycopg2.extras.DictCursor)
        return conn
    else:
        # Fallback to local SQLite development
        conn = sqlite3.connect('portfolio.db')
        conn.row_factory = sqlite3.Row
        return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    if DATABASE_URL and HAS_POSTGRES:
        # PostgreSQL syntax for table creation
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                stack TEXT,
                link TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
    else:
        # SQLite syntax for local development
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                stack TEXT,
                link TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
    conn.commit()
    conn.close()