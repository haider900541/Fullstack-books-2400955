"use server";

import { AdminParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Admin from "../database/models/admin.model";

export const createAdmin = async ({ Name, Email, Role }: AdminParams) => {
  try {
    await connectToDatabase();

    const newAdmin = await Admin.create({
      name: Name,
      email: Email,
      role: Role,
    });

    return JSON.parse(JSON.stringify(newAdmin));
  } catch (error) {
    handleError(error);
  }
};

export const getAllAdmins = async () => {
  try {
    await connectToDatabase();

    const admins = await Admin.find().lean();

    return JSON.parse(JSON.stringify(admins));
  } catch (error) {
    handleError(error);
  }
};

export const deleteAdmin = async (adminId: string) => {
  try {
    await connectToDatabase();

    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      throw new Error("Admin not found");
    }

    return { message: "Admin deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export async function isAdmin(email: string): Promise<boolean> {
  if (!email) {
    return false;
  }

  try {
    await connectToDatabase();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log(`No admin found for email: ${email}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function getAdminRole(email: string): Promise<string | null> {
  if (!email) {
    return null;
  }

  try {
    await connectToDatabase();

    const admin = await Admin.findOne({ email }).select("role"); // only fetch role

    if (!admin) {
      console.log(`No admin found for email: ${email}`);
      return null;
    }

    return admin.role;
  } catch (error) {
    console.error("Error fetching admin role:", error);
    return null;
  }
}
