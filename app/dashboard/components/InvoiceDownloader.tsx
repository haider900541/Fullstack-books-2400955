"use client";

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import InvoiceTemplate from "./InvoiceTemplate";
import { IOrder } from "@/lib/database/models/order.model";
import { ISetting } from "@/lib/database/models/setting.model";

export default function InvoiceDownloader({
  order,
  setting,
}: {
  order: IOrder;
  setting: ISetting;
}) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`invoice_${order.orderId || order._id}.pdf`);
  };

  return (
    <div>
      {/* Download Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Download className="w-4 h-4" /> Download Invoice
        </button>
      </div>

      {/* Hidden Invoice Template */}
      <div ref={invoiceRef} className="absolute left-[-9999px] top-0">
        <InvoiceTemplate order={order} setting={setting} />
      </div>
    </div>
  );
}
