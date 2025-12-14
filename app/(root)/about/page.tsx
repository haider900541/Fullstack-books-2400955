import Loader from "@/components/shared/Loader";
import { getSetting } from "@/lib/actions/setting.actions";
import { ISetting } from "@/lib/database/models/setting.model";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaUsers,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default async function AboutPage() {
  const settings: ISetting | null = await getSetting();

  if (!settings) {
    return <Loader />;
  }

  const socialLinks = [
    {
      href: settings.facebook,
      label: "Facebook",
      icon: <FaFacebookF />,
    },
    {
      href: settings.instagram,
      label: "Instagram",
      icon: <FaInstagram />,
    },
    {
      href: settings.twitter,
      label: "Twitter",
      icon: <FaTwitter />,
    },
    {
      href: settings.facebookGroup,
      label: "facebookGroup",
      icon: <FaUsers />,
    },
    {
      href: settings.youtube,
      label: "YouTube",
      icon: <FaYoutube />,
    },
  ].filter((link) => link.href);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="wrapper max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">
          About <span className="text-primary-600">{settings.name}</span>
        </h1>

        {settings.tagline && (
          <p className="mb-8 text-xl italic text-gray-600 dark:text-gray-400 border-l-4 border-primary-600 pl-4">
            {settings.tagline}
          </p>
        )}

        {settings.description && (
          <div
            className="
            prose prose-base max-w-none dark:prose-invert
            prose-headings:font-semibold prose-headings:text-gray-900
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-strong:font-semibold prose-strong:text-gray-900
            prose-em:italic prose-em:text-gray-800
            prose-u:underline
            prose-ul:list-disc prose-ul:pl-5
            prose-ol:list-decimal prose-ol:pl-5
            prose-li:marker:text-gray-500
            prose-blockquote:border-l-2 prose-blockquote:border-gray-300 prose-blockquote:pl-3 prose-blockquote:text-gray-600 italic
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-pink-600
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-md prose-pre:p-3
            prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
            prose-img:block prose-img:mx-auto prose-img:rounded-md prose-img:shadow-md prose-img:my-4 prose-img:max-w-full prose-img:h-auto
          "
            dangerouslySetInnerHTML={{ __html: settings.description }}
          />
        )}

        {settings.aboutUs && (
          <div
            className="
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-strong:font-bold prose-strong:text-black
                prose-em:text-gray-800 prose-em:italic
                prose-u:underline
                prose-ul:list-disc prose-ul:pl-5
                prose-ol:list-decimal prose-ol:pl-5
                prose-li:marker:text-gray-500
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:text-gray-600 italic
                prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-pink-600
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
                prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-a:font-medium
                prose-img:rounded-lg prose-img:shadow-md
                prose prose-lg dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: settings.aboutUs }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Contact Information
            </h2>

            <p className="mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-3">
              <FaEnvelope className="text-primary-600" />
              <a
                href={`mailto:${settings.email}`}
                className="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 transition"
              >
                {settings.email}
              </a>
            </p>

            <p className="mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-3">
              <FaPhone className="text-primary-600" />
              <a
                href={`tel:${settings.phoneNumber}`}
                className="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 transition"
              >
                {settings.phoneNumber}
              </a>
            </p>

            {settings.address && (
              <p className="text-gray-700 dark:text-gray-300 flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary-600" />
                {settings.address}
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Follow Us
            </h2>

            <ul className="flex flex-wrap gap-6">
              {socialLinks.map(({ href, label, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 bg-primary-600 text-white rounded-md shadow-md hover:bg-primary-700 transition"
                    aria-label={label}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
