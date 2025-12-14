import ContactUs from "@/components/shared/ContactUs";
import Loader from "@/components/shared/Loader";
import { getSetting } from "@/lib/actions/setting.actions";
import { ISetting } from "@/lib/database/models/setting.model";

export default async function ContactPage() {
  const settings: ISetting | null = await getSetting();

  if (!settings) {
    return <Loader />;
  }
  return (
    <>
      <section className="max-w-7xl mx-auto space-y-8 p-4">
        <div className="wrapper max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">
            Contact <span className="text-primary-600">{settings.name}</span>
          </h1>
        </div>
        <ContactUs />
      </section>
    </>
  );
}
