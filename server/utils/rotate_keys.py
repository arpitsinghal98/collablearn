import secrets
import json
import os

KEY_FILE = "secret_keys.json"

def load_keys():
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, "r") as f:
            return json.load(f)
    return {}

def save_keys(keys):
    with open(KEY_FILE, "w") as f:
        json.dump(keys, f, indent=4)

def rotate_key():
    keys = load_keys()
    current_version = len(keys) + 1
    new_key = secrets.token_hex(32)
    keys[f"v{current_version}"] = new_key
    save_keys(keys)
    print(f"New key version v{current_version} added.")

rotate_key()