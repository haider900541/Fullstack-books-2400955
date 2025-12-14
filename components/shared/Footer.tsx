"use client";

import { getSetting } from "@/lib/actions/setting.actions";
import { ISetting } from "@/lib/database/models/setting.model";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaUsers,
  FaYoutube,
} from "react-icons/fa";

const socialIcons: Record<string, React.JSX.Element> = {
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  twitter: <FaTwitter />,
  facebookGroup: <FaUsers />,
  youtube: <FaYoutube />,
};

const socialKeys: (keyof ISetting)[] = [
  "facebook",
  "instagram",
  "twitter",
  "facebookGroup",
  "youtube",
];

const Footer = () => {
  const [settings, setSettings] = useState<ISetting | null>(null);

  useEffect(() => {
    (async () => {
      const setting = await getSetting();
      setSettings(setting);
    })();
  }, []);

  const socialLinks = settings
    ? socialKeys
        .map((key) => {
          const href = settings[key];
          if (!href) return null;
          return {
            href,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            icon: socialIcons[key as keyof typeof socialIcons],
          };
        })
        .filter(Boolean) as {
        href: string;
        label: string;
        icon: React.JSX.Element;
      }[]
    : [];

  return (
    <footer className="text-white">
      <div className="grid md:grid-cols-2 gap-6 items-center bg-[#3e0078] p-4 pb-6">
        <div>
          <a href={"/"} className="flex flex-col items-center gap-1">
            <Image
              src={settings?.logo || "/assets/images/logo.png"}
              width={200}
              height={200}
              alt={settings?.name || "Logo"}
              priority
            />
            {settings?.tagline && (
              <p className="mb-8 text-xl italic text-white dark:text-orange-400 border-l-4 border-primary pl-4">
                {settings.tagline}
              </p>
            )}
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {/* Organization Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">
              Organization
            </h4>
            <ul className="space-y-2">
              <li>
                <a href={"/"} className="hover:underline hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:underline hover:text-white"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us Links - Dynamic */}
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">
              Follow us
            </h4>
            <ul className="space-y-2">
              {socialLinks.map(({ href, label, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-white flex items-center gap-2"
                  >
                    {icon} {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/policies#return-policy"
                  className="hover:underline hover:text-white"
                >
                  Return Policy
                </a>
              </li>
              <li>
                <a
                  href="/policies#terms-of-service"
                  className="hover:underline hover:text-white"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/policies#privacy-policy"
                  className="hover:underline hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-2 w-full text-white bg-[#1d0237] px-4 py-2">
        <p className="text-sm">
          Copyright © 2025 - All rights reserved by{" "}
          <a href={"/"} className="hover:underline hover:text-primary">
            {settings?.name}
          </a>
        </p>
        <p className="text-sm flex items-center gap-2">
          Developed by{" "}
          <a
            href="https://www.artistycode.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            ArtistyCode Studio
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
