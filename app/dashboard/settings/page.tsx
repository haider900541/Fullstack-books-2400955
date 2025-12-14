import React from "react";
import { getSetting, upsertSetting } from "@/lib/actions/setting.actions";
import SettingForm, { SettingFormValues } from "../components/SettingForm";

export default async function SettingsPage() {
  const setting = await getSetting();

  async function onSubmit(data: SettingFormValues) {
    "use server";
    await upsertSetting(data);
  }

  return (
    <main className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">General Settings</h1>
        <SettingForm initialData={setting ?? undefined} onSubmit={onSubmit} />
      </div>
    </main>
  );
}
