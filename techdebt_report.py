import os
import subprocess
import json
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime


def run(cmd):
    """Execute shell commands safely and return output"""
    try:
        result = subprocess.run(cmd, shell=True, text=True, 
capture_output=True)
        return result.stdout.strip()
    except Exception as e:
        return str(e)


def analyze_repo(repo_path):
    print(f"Analyzing repo: {repo_path}")
    pylint_score = run(f"pylint {repo_path} --score=y | tail -n 2 | grep 
'rated at'")
    radon_score = run(f"radon mi {repo_path} -s -a")
    bandit_score = run(f"bandit -r {repo_path} -f json")

    try:
        bandit_json = json.loads(bandit_score)
        security_issues = len(bandit_json.get("results", []))
    except Exception:
        security_issues = "Error parsing bandit output"

    return {
        "Pylint Summary": pylint_score or "N/A",
        "Maintainability": radon_score or "N/A",
        "Security Issues Found": security_issues,
    }


def generate_pdf(report, output_file):
    c = canvas.Canvas(output_file, pagesize=A4)
    w, h = A4
    c.setFont("Helvetica-Bold", 18)
    c.drawString(80, h - 60, "TechDebtZero • AI Code Quality Report")
    c.setFont("Helvetica", 12)

    y = h - 120
    for k, v in report.items():
        c.drawString(80, y, f"{k}: {v}")
        y -= 20

    c.drawString(80, y - 30, f"Generated: 
{datetime.now().strftime('%Y-%m-%d %H:%M')}")
    c.save()


if __name__ == "__main__":
    repo_path = input("Enter path to repo (e.g., ./core or ./src): 
").strip()
    report = analyze_repo(repo_path)
    os.makedirs("reports", exist_ok=True)
    out_path = 
f"reports/TechDebtReport_{datetime.now().strftime('%Y%m%d_%H%M')}.pdf"
    generate_pdf(report, out_path)
    print(f"✅ Report saved to {out_path}")

