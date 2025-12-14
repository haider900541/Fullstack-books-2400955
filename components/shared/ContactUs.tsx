"use client";

import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaUsers,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { getSetting } from "@/lib/actions/setting.actions";
import Loader from "@/components/shared/Loader";
import { ISetting } from "@/lib/database/models/setting.model";

export default function ContactUs() {
  const [settings, setSettings] = useState<ISetting | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch settings client side on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSetting();
        setSettings(data);
      } catch {
        setSettings(null);
      } finally {
        setLoadingSettings(false);
      }
    }
    fetchSettings();
  }, []);

  const socials = settings
    ? [
        { name: "Facebook", url: settings.facebook, icon: <FaFacebookF /> },
        { name: "Instagram", url: settings.instagram, icon: <FaInstagram /> },
        { name: "Twitter", url: settings.twitter, icon: <FaTwitter /> },
        {
          name: "facebookGroup",
          url: settings.facebookGroup,
          icon: <FaUsers />,
        },
      ].filter((social) => social.url)
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("SUCCESS");
        toast.success("Message sent successfully!");
        setFormData({ user_name: "", user_email: "", phone: "", message: "" });
      } else {
        setStatus("FAILED");
        toast.error("Failed to send the message.");
      }
    } catch {
      setStatus("FAILED");
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingSettings) return <Loader />;

  if (!settings)
    return (
      <div className="flex items-center justify-center min-h-screen text-primary-600">
        Failed to load settings.
      </div>
    );

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-4xl p-6 md:p-10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          Contact Us
        </h2>

        {!status && (
          <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-lg mx-auto">
            Feel free to reach out to us with your ideas, suggestions, or any
            questions.
          </p>
        )}

        {status === "SUCCESS" && (
          <p className="text-center text-green-600 font-semibold mb-10">
            Message sent successfully!
          </p>
        )}

        {status === "FAILED" && (
          <p className="text-center text-primary-600 font-semibold mb-10">
            Failed to send the message. Please try again.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Follow Us
            </h3>
            <ul className="flex flex-wrap gap-4 w-full">
              {socials.map(({ name, url, icon }) => (
                <li key={name}>
                  <Link
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="flex items-center gap-3 p-3 bg-primary-600 text-white rounded-md shadow-md hover:bg-primary-700 transition"
                  >
                    <span className="text-lg">{icon}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-2 space-y-6"
            noValidate
          >
            <div>
              <Label
                htmlFor="user_name"
                className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
              >
                Name
              </Label>
              <Input
                type="text"
                id="user_name"
                name="user_name"
                placeholder="Your name"
                value={formData.user_name}
                onChange={handleChange}
                required
                className="shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="user_email"
                className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
              >
                Email
              </Label>
              <Input
                type="email"
                id="user_email"
                name="user_email"
                placeholder="you@example.com"
                value={formData.user_email}
                onChange={handleChange}
                required
                className="shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="phone"
                className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
              >
                Phone
              </Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
                required
                className="shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="message"
                className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
              >
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                required
                className="shadow-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold text-lg ${
                loading
                  ? "bg-primary-500 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-600"
              } text-white rounded-md transition`}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
