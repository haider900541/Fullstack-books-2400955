"use server";

import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Setting from "../database/models/setting.model";
import { SettingParams } from "@/types";

// ====== CREATE SETTING (only if none exists)
export const createSetting = async (params: SettingParams) => {
  try {
    await connectToDatabase();

    const existing = await Setting.findOne();
    if (existing) {
      throw new Error("Settings already exist");
    }

    const newSetting = await Setting.create(params);
    return JSON.parse(JSON.stringify(newSetting));
  } catch (error) {
    handleError(error);
  }
};

// ====== GET SINGLE SETTING
export const getSetting = async () => {
  try {
    await connectToDatabase();
    const setting = await Setting.findOne().lean();
    return setting ? JSON.parse(JSON.stringify(setting)) : null;
  } catch (error) {
    handleError(error);
  }
};

// ====== UPSERT SETTING (update if exists, else create)
export const upsertSetting = async (
  updateData: Partial<SettingParams>
) => {
  try {
    await connectToDatabase();

    const setting = await Setting.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    return JSON.parse(JSON.stringify(setting));
  } catch (error) {
    handleError(error);
  }
};
