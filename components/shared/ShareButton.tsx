"use client";

import { FaRegShareFromSquare, FaShareFromSquare } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useState } from "react";

interface ShareButtonProps {
  productId: string;
  productName: string;
}

const ShareButton = ({ productId, productName }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/products/${productId}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${productName}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        toast.error("Failed to copy the link.");
        console.error("Error copying:", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-primary-900"
    >
      {copied ? (
        <FaShareFromSquare className="size-6" />
      ) : (
        <FaRegShareFromSquare className="size-6" />
      )}
    </button>
  );
};

export default ShareButton;
