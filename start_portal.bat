"""Simple HTTP server for therapist portal"""
import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print("=" * 50)
    print("🏥 NeuraLife Therapist Portal Server")
    print("=" * 50)
    print(f"✅ Server running at: http://localhost:{PORT}")
    print(f"📂 Serving files from: {DIRECTORY}")
    print("\n🔑 Test Login:")
    print("   Email: sarah@neuralife.com")
    print("   Password: therapist123")
    print("\n❌ Press Ctrl+C to stop the server")
    print("=" * 50)
    httpd.serve_forever()
