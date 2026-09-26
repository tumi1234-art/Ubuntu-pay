import jsPDF from "jspdf";

interface Transaction {
  date: string;
  member: string;
  type: string;
  amount: number;
  balance: number;
}

export const generateStatementPDF = (transactions: Transaction[], month: string) => {
  const doc = new jsPDF();
  const primaryGreen = [144, 203, 123]; // Ubuntu Pay sage #90CB7B

  // Header bar
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(0, 0, 210, 35, "F");

  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("UbuntuPay", 15, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Empowering Stokvels Digitally", 15, 26);

  // Statement title
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Financial Statement - ${month}`, 15, 48);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-ZA")}`, 15, 55);
  doc.text("Stokvel: Ubuntu Savings Group", 15, 60);

  // Table header
  const startY = 70;
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(15, startY, 180, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Date", 18, startY + 5.5);
  doc.text("Member", 50, startY + 5.5);
  doc.text("Type", 95, startY + 5.5);
  doc.text("Amount", 138, startY + 5.5);
  doc.text("Balance", 168, startY + 5.5);

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setTextColor(33, 33, 33);
  transactions.forEach((t, i) => {
    const y = startY + 8 + i * 8;
    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, y, 180, 8, "F");
    }
    doc.setFontSize(8);
    doc.text(new Date(t.date).toLocaleDateString("en-ZA"), 18, y + 5.5);
    doc.text(t.member, 50, y + 5.5);
    doc.text(t.type, 95, y + 5.5);

    if (t.amount >= 0) {
      doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    doc.text(`R ${Math.abs(t.amount).toLocaleString()}`, 138, y + 5.5);
    doc.setTextColor(33, 33, 33);
    doc.text(`R ${t.balance.toLocaleString()}`, 168, y + 5.5);
  });

  // Summary
  const summaryY = startY + 8 + transactions.length * 8 + 10;
  doc.setFillColor(240, 248, 230);
  doc.rect(15, summaryY, 180, 20, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);

  const totalIn = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  doc.text(`Total In: R ${totalIn.toLocaleString()}`, 20, summaryY + 8);
  doc.setTextColor(220, 38, 38);
  doc.text(`Total Out: R ${totalOut.toLocaleString()}`, 80, summaryY + 8);
  doc.setTextColor(33, 33, 33);
  doc.text(`Net: R ${(totalIn - totalOut).toLocaleString()}`, 145, summaryY + 8);

  // Footer
  const footerY = 280;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, footerY, 195, footerY);
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text("UbuntuPay - Empowering Stokvels Digitally | www.ubuntupay.co.za", 105, footerY + 5, { align: "center" });
  doc.text("This is a system-generated statement.", 105, footerY + 9, { align: "center" });

  doc.save(`UbuntuPay_Statement_${month.replace(" ", "_")}.pdf`);
};
