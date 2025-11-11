import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
import os

def analyze_aws_cost(csv_path):
    df = pd.read_csv(csv_path)
    df['UnblendedCost'] = pd.to_numeric(df['UnblendedCost'], 
errors='coerce')
    total = df['UnblendedCost'].sum()
    top_services = 
df.groupby('ServiceName')['UnblendedCost'].sum().nlargest(5)
    return total, top_services

def generate_pdf(total, top_services):
    os.makedirs("reports", exist_ok=True)
    output = 
f"reports/AWS_CostReport_{datetime.now().strftime('%Y%m%d_%H%M')}.pdf"
    c = canvas.Canvas(output, pagesize=A4)
    w, h = A4
    c.setFont("Helvetica-Bold", 18)
    c.drawString(80, h-60, "CloudShift • AWS Cost Optimization Report")
    c.setFont("Helvetica", 12)
    y = h-120
    c.drawString(80, y, f"Total Monthly Cost: ${total:,.2f}")
    y -= 30
    c.drawString(80, y, "Top 5 Costly Services:")
    y -= 20
    for svc, cost in top_services.items():
        c.drawString(100, y, f"- {svc}: ${cost:,.2f}")
        y -= 20
    c.save()
    print(f"✅ AWS cost report saved to {output}")

if __name__ == "__main__":
    path = input("Enter AWS Cost Explorer CSV path: ").strip()
    total, top = analyze_aws_cost(path)
    generate_pdf(total, top)

