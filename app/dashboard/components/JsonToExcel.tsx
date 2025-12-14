/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface JsonToExcelProps {
  data: any[];
  fileName?: string;
}

const JsonToExcel = ({ data, fileName }: JsonToExcelProps) => {
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, fileName || "data.xlsx");
  };

  return (
    <Button
      variant={"outline"}
      className="rounded-full"
      onClick={handleDownloadExcel}
    >
      <Download />
    </Button>
  );
};

export default JsonToExcel;
