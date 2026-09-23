import os
from database import get_db, init_db
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask import request, jsonify
from google import genai
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

client = genai.Client()

@app.route('/api/chat', methods=['POST'])
def chat_with_ai():
    data = request.get_json()
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # Define your persona / system instructions
    system_instruction = (
        "You are an AI portfolio assistant for Fellah, a software engineering student "
        "and network engineering practitioner skilled in Python, Flask, React, JavaScript, "
        "PHP, Linux administration, and Cisco networking. Answer questions professionally "
        "and helpfully on behalf of Fellah based on this profile. Keep responses concise."
    )

    try:
        # Use client.chats to properly handle system instructions and messaging with the updated model ID
        chat = client.chats.create(
            model='gemini-3.6-flash',
            config={
                'system_instruction': system_instruction,
            }
        )
        response = chat.send_message(user_message)
        return jsonify({'reply': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
init_db()


@app.route("/", methods=["GET"])
def health_check():
  return jsonify({"status": "online", "service": "Portfolio API"})


@app.route("/api/test", methods=["GET"])
def test_connection():
  return jsonify({
      "status": "success",
      "message": "Backend and frontend are connected successfully!"
  })


@app.route("/api/projects", methods=["GET"])
def get_projects():
  db = get_db()
  rows = db.execute("SELECT * FROM projects ORDER BY id DESC").fetchall()
  db.close()
  return jsonify([dict(row) for row in rows])


@app.route("/api/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
  db = get_db()
  row = db.execute(
      "SELECT * FROM projects WHERE id = ?", (project_id,)
  ).fetchone()
  db.close()
  if not row:
    return jsonify({"error": "Project not found"}), 404
  return jsonify(dict(row))


@app.route("/api/projects", methods=["POST"])
def create_project():
  data = request.get_json()
  if not data or not data.get("title"):
    return jsonify({"error": "Title is required"}), 400

  db = get_db()
  cursor = db.cursor()
  cursor.execute(
      "INSERT INTO projects (title, description, stack, link) VALUES (?, ?, ?, ?)",
      (
          data.get("title"),
          data.get("description", ""),
          data.get("stack", ""),
          data.get("link", ""),
      ),
  )
  db.commit()
  new_id = cursor.lastrowid
  db.close()
  return jsonify({"id": new_id, "message": "Project created successfully"}), 201


@app.route("/api/projects/<int:project_id>", methods=["PUT"])
def update_project(project_id):
  data = request.get_json()
  db = get_db()
  cursor = db.cursor()
  cursor.execute(
      """UPDATE projects 
           SET title = COALESCE(?, title), 
               description = COALESCE(?, description), 
               stack = COALESCE(?, stack), 
               link = COALESCE(?, link) 
           WHERE id = ?""",
      (
          data.get("title"),
          data.get("description"),
          data.get("stack"),
          data.get("link"),
          project_id,
      ),
  )
  db.commit()
  updated = cursor.rowcount > 0
  db.close()
  if not updated:
    return jsonify({"error": "Project not found"}), 404
  return jsonify({"message": "Project updated successfully"})


@app.route("/api/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
  db = get_db()
  cursor = db.cursor()
  cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
  db.commit()
  deleted = cursor.rowcount > 0
  db.close()
  if not deleted:
    return jsonify({"error": "Project not found"}), 404
  return jsonify({"message": "Project deleted successfully"})


@app.route('/api/contact', methods=['POST'])
def handle_contact():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No data provided"}), 400
        
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    
    if not name or not email or not message:
        return jsonify({"status": "error", "message": "All fields are required!"}), 400
    
    try:
        db = get_db()
        cursor = db.cursor()
        # Ensure the contacts table exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        cursor.execute(
            "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
            (name, email, message)
        )
        db.commit()
        db.close()
    except Exception as e:
        print("Database error:", e)
        return jsonify({"status": "error", "message": "Failed to save message to database."}), 500
    
    print(f"Saved message from {name} ({email}) to database.")
    
    return jsonify({
        "status": "success",
        "message": "Thank you! Your message has been saved successfully."
    }), 200


if __name__ == "__main__":
  app.run(host="127.0.0.1", port=5001, debug=True)