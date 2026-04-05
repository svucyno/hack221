import urllib.request
import json
import time

max_retries = 10
for i in range(max_retries):
    try:
        req = urllib.request.Request("http://127.0.0.1:8000/health")
        with urllib.request.urlopen(req) as response:
            health_data = json.loads(response.read())
            if health_data.get("status") == "running":
                break
    except Exception as e:
        print(f"Waiting for server... ({i+1}/{max_retries})")
        time.sleep(2)

print("\n=== Testing /health ===")
try:
    req = urllib.request.Request("http://127.0.0.1:8000/health")
    with urllib.request.urlopen(req) as response:
        print(json.dumps(json.loads(response.read()), indent=2))
except Exception as e:
    print("Health check failed:", e)

print("\n=== Testing /recommend ===")
data = json.dumps({
    "skills": ["Python", "Machine Learning", "TensorFlow"],
    "projects": [],
    "education": "",
    "certifications": []
}).encode('utf-8')
req = urllib.request.Request("http://127.0.0.1:8000/recommend", data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print(json.dumps(json.loads(response.read()), indent=2))
except Exception as e:
    print("Recommend check failed:", e)
