import os
import sys

# Ensure we are inside the backend directory
os.path.dirname(os.path.abspath(__file__))

if __name__ == "__main__":
  # Import and run your Flask app directly
  from app import app

  print("Starting Portfolio Flask Server...")
  app.run(host="127.0.0.1", port=5001, debug=True)