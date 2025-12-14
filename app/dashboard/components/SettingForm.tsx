"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/shared/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { Textarea } from "@/components/ui/textarea";

const settingSchema = z.object({
  logo: z.string().min(1, "Logo is required"),
  favicon: z.string().min(1, "Favicon is required"),
  name: z.string().min(1, "Name is required"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().optional(),
  registrationAmount: z.string().min(0).optional(),
  deliveryCharge: z.object({
    insideDhaka: z.coerce.string().min(0).optional(),
    outSideDhaka: z.coerce.string().min(0).optional(),
    PickupPoint: z.coerce.string().min(0).optional(),
  }),
  facebook: z.string().url().optional(),
  instagram: z.string().url().optional(),
  twitter: z.string().url().optional(),
  facebookGroup: z.string().url().optional(),
  youtube: z.string().url().optional(),
  aboutUs: z.string().optional(),
  returnPolicy: z.string().optional(),
  termsOfService: z.string().optional(),
  privacyPolicy: z.string().optional(),
});

export type SettingFormValues = z.infer<typeof settingSchema>;

type Props = {
  initialData?: Partial<SettingFormValues>;
  onSubmit: (data: SettingFormValues) => Promise<void>;
};

export default function SettingForm({ initialData, onSubmit }: Props) {
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(settingSchema),
    defaultValues: initialData || {},
  });

  // Save helper
  const saveField = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    try {
      await onSubmit(form.getValues());
      toast.success("Settings saved!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <Form {...form}>
      <form className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Logo */}
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo *</FormLabel>
                <FormControl>
                  <FileUploader
                    imageUrl={field.value || ""}
                    onFieldChange={async (_blobUrl, files) => {
                      if (files && files.length > 0) {
                        const uploaded = await startUpload(files);
                        if (uploaded && uploaded[0]) {
                          form.setValue("logo", uploaded[0].url, {
                            shouldValidate: true,
                          });
                          saveField();
                        }
                      }
                    }}
                    setFiles={() => {}}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Favicon */}
          <FormField
            control={form.control}
            name="favicon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Favicon *</FormLabel>
                <FormControl>
                  <FileUploader
                    imageUrl={field.value || ""}
                    onFieldChange={async (_blobUrl, files) => {
                      if (files && files.length > 0) {
                        const uploaded = await startUpload(files);
                        if (uploaded && uploaded[0]) {
                          form.setValue("favicon", uploaded[0].url, {
                            shouldValidate: true,
                          });
                          saveField();
                        }
                      }
                    }}
                    setFiles={() => {}}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Name *</FormLabel>
              <FormControl>
                <Input placeholder="Site name" {...field} onBlur={saveField} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tagline */}
        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input placeholder="Tagline" {...field} onBlur={saveField} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={(val) => {
                    field.onChange(val);
                    saveField();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  {...field}
                  onBlur={saveField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Phone number"
                  {...field}
                  onBlur={saveField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  className="input w-full resize-none"
                  onBlur={saveField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Registration Amount */}
        <FormField
          control={form.control}
          name="registrationAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Registration Amount"
                  value={
                    typeof field.value === "string" ||
                    typeof field.value === "number"
                      ? field.value
                      : ""
                  }
                  onChange={field.onChange}
                  onBlur={saveField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Delivery Charge */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Delivery Charge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="deliveryCharge.insideDhaka"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inside Dhaka</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Inside Dhaka delivery charge..."
                      value={
                        typeof field.value === "string" ||
                        typeof field.value === "number"
                          ? field.value
                          : ""
                      }
                      onChange={field.onChange}
                      onBlur={saveField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryCharge.outSideDhaka"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outside Dhaka</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Outside Dhaka delivery charge..."
                      value={
                        typeof field.value === "string" ||
                        typeof field.value === "number"
                          ? field.value
                          : ""
                      }
                      onChange={field.onChange}
                      onBlur={saveField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryCharge.PickupPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pick-Up Point</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Pick-Up Point delivery charge..."
                      value={
                        typeof field.value === "string" ||
                        typeof field.value === "number"
                          ? field.value
                          : ""
                      }
                      onChange={field.onChange}
                      onBlur={saveField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Social Media URLs */}
        {["facebook", "instagram", "twitter", "facebookGroup", "youtube"].map(
          (field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as keyof SettingFormValues}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>
                    {field.charAt(0).toUpperCase() + field.slice(1)} URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder={`${field} URL`}
                      value={
                        typeof f.value === "string" ||
                        typeof f.value === "number"
                          ? f.value
                          : ""
                      }
                      onChange={f.onChange}
                      onBlur={saveField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        )}

        {/* About Us */}
        <FormField
          control={form.control}
          name="aboutUs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Us</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={(val) => {
                    field.onChange(val);
                    saveField();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Return Policy */}
        <FormField
          control={form.control}
          name="returnPolicy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Policy</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={(val) => {
                    field.onChange(val);
                    saveField();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms of Service */}
        <FormField
          control={form.control}
          name="termsOfService"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms of Service</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={(val) => {
                    field.onChange(val);
                    saveField();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Privacy Policy */}
        <FormField
          control={form.control}
          name="privacyPolicy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Privacy Policy</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={(val) => {
                    field.onChange(val);
                    saveField();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
