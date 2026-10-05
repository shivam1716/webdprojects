"""Download the full public India UPI ecosystem dataset used by this project.
Run with Python on a machine with internet access:
  python scripts/download-india-dataset.py
"""
from pathlib import Path
import urllib.request

url = "https://huggingface.co/datasets/prasad-gade05/india-upi-ecosystem-2018-2025/resolve/main/data/train-00000-of-00001.parquet?download=true"
out = Path("public/data/india/india_upi_ecosystem_2018_2025.parquet")
out.parent.mkdir(parents=True, exist_ok=True)
print(f"Downloading to {out} ...")
urllib.request.urlretrieve(url, out)
print(f"Saved {out} ({out.stat().st_size:,} bytes)")
