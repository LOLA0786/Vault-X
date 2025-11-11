import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
import os

def analyze_azure_cost(csv_path):
    df = pd.read_csv(csv_path)
    cost_col = [c for c in df.columns if 'Cost' in c][0]
    total = df[cost_col].sum()
    top_resources = 
df.groupby('MeterCategory')[cost_col].sum().nlargest(5)
    return total, top_resources

def generate_pdf(total, top_resources):
    os.makedirs("reports", exist_ok=True)
    output = 
f"reports/Azure_CostReport_{datetime.now().strftime('%Y%m%d_%H%M')}.pdf"
    c = canvas.Canvas(output, pagesize=A4)
    w, h = A4
    c.setFont("Helvetica-Bold", 18)
    c.drawString(80, h-60, "CloudShift • Azure Cost Optimization Report")
    c.setFont("Helvetica", 12)
    y = h-120
    c.drawString(80, y, f"Total Monthly Cost: ${total:,.2f}")
    y -= 30
    c.drawString(80, y, "Top 5 Resource Categories:")
    y -= 20
    for res, cost in top_resources.items():
        c.drawString(100, y, f"- {res}: ${cost:,.2f}")
        y -= 20
    c.save()
    print(f"✅ Azure cost report saved to {output}")

if __name__ == "__main__":
    path = input("Enter Azure usage CSV path: ").strip()
    total, top = analyze_azure_cost(path)
    generate_pdf(total, top)

