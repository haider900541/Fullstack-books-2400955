"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";

type Buyer = {
  _id: string;
  name: string;
  email: string;
  number: string;
  district: string;
  address: string;
  shopName: string;
  shopLogo?: string;
  totalOrders?: string;
  successfulOrder?: string;
  canceledOrder?: string;
  totalSpend?: string;
  totalPaid?: string;
  totalDue?: string;
  createdAt: string | Date;
};

interface BuyerDetailsViewProps {
  buyer: Buyer;
}

const BuyerDetailsView = ({ buyer }: BuyerDetailsViewProps) => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Profile Card */}
      <Card className="p-6 shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-6">
            Buyer Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Details */}
            <div className="flex-grow space-y-4 text-gray-800">
              <h2 className="text-2xl font-semibold">{buyer.name}</h2>
              <p className="text-lg">{buyer.email}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Phone:</span> {buyer.number}
                </div>
                <div>
                  <span className="font-semibold">District:</span>{" "}
                  {buyer.district}
                </div>
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  {buyer.address}
                </div>
                <div>
                  <span className="font-semibold">Created At:</span>{" "}
                  {new Date(buyer.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Statistics */}
      <Card className="p-6 shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold mb-4">
            Order Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <Badge variant="secondary" className="px-5 py-3 text-base">
              Total Orders: {buyer.totalOrders ?? 0}
            </Badge>
            <Badge className="bg-green-600 text-white px-5 py-3 text-base">
              Successful Orders: {buyer.successfulOrder ?? 0}
            </Badge>
            <Badge className="bg-red-600 text-white px-5 py-3 text-base">
              Canceled Orders: {buyer.canceledOrder ?? 0}
            </Badge>
            <Badge className="bg-blue-600 text-white px-5 py-3 text-base">
              Total Spend: ${buyer.totalSpend ?? 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a href={`/dashboard/buyers/${buyer._id}`} className="flex-1">
          <Button
            size="lg"
            className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            <Eye /> Go to Dashboard
          </Button>
        </a>
        <a href={`/dashboard/buyers/${buyer._id}/update`} className="flex-1">
          <Button
            size="lg"
            variant="outline"
            className="w-full rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Pencil /> Edit Profile
          </Button>
        </a>
      </div>
    </section>
  );
};

export default BuyerDetailsView;
