import requests

url = "http://127.0.0.1:8000/api/summarize"
file_path = "C:/Users/Saraf Nihal chandra/OneDrive/Desktop/sample.txt"

with open(file_path, "rb") as f:
    response = requests.post(url, files={"file": f})

print(response.json())
