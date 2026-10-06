import webview

from api import Api

DEV_URL = "http://localhost:5173"

def main():
    webview.create_window("File Organiser", DEV_URL, js_api=Api(), width=800, height=600)
    webview.start()

if __name__ == "__main__":
    main()