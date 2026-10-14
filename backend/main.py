import webview

from api import Api

def run(url: str):
    webview.create_window("File Organiser", url, js_api=Api(), width=800, height=600)
    webview.start()

if __name__ == "__main__":
    run("../frontend/dist/index.html") 