from PyPDF2 import PdfMerger
import glob, os

os.makedirs("reports", exist_ok=True)
merger = PdfMerger()
for pdf in sorted(glob.glob("reports/*Report_*.pdf")):
    merger.append(pdf)
output = "reports/PrivateVault_CombinedReport.pdf"
merger.write(output)
merger.close()
print(f"✅ Combined report saved to {output}")

