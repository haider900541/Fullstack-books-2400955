"use server";

import { BannerParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Banner from "../database/models/banner.model";

export const createBanner = async (params: BannerParams) => {
  try {
    await connectToDatabase();
    const newBanner = await Banner.create(params);
    return JSON.parse(JSON.stringify(newBanner));
  } catch (error) {
    handleError(error);
  }
};

export const getAllBanners = async () => {
  try {
    await connectToDatabase();

    const banners = await Banner.find().lean();

    return JSON.parse(JSON.stringify(banners));
  } catch (error) {
    handleError(error);
  }
};

export const deleteBanner = async (bannerId: string) => {
  try {
    await connectToDatabase();

    const deletedBanner = await Banner.findByIdAndDelete(bannerId);

    if (!deletedBanner) {
      throw new Error("Banner not found");
    }

    return { message: "Banner deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};



