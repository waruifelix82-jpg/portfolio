import sqlite3


def init_db():
  conn = sqlite3.connect("portfolio.db")
  cursor = conn.cursor()

  # 1. Fixed table name to 'projects'
  cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            stack TEXT NOT NULL,
            link TEXT NOT NULL
        )
    """)

  # 2. Inserting a sample row safely
  cursor.execute("""
        INSERT OR IGNORE INTO projects(id, title, description, stack, link)
          VALUES (1, 'PORTFOLIO API', 'flask backend for personal profile', 'Python, Flask', 'https://github.com')
    """)

  conn.commit()
  conn.close()
  print("Database initialized and sample data inserted.")


# 3. Unindented to global scope so it runs when executing this file
if __name__ == "__main__":
  init_db()