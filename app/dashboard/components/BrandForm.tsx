"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createBrand, updateBrand } from "@/lib/actions/brand.actions";
import { IBrand } from "@/lib/database/models/brand.model";
import toast from "react-hot-toast";

export const brandFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
});

type BrandFormProps = {
  type: "Create" | "Update";
  brand?: IBrand;
  brandId?: string;
};

const BrandForm = ({ type, brand, brandId }: BrandFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof brandFormSchema>>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      title: brand?.title || "",
    },
  });

  async function onSubmit(values: z.infer<typeof brandFormSchema>) {
    try {
      if (type === "Create") {
        const newBrand = await createBrand({ title: values.title });
        if (newBrand) {
          form.reset();
          toast.success("Brand created successfully!");
          router.push(`/dashboard/brands`);
        }
      } else if (type === "Update" && brandId) {
        const updatedBrand = await updateBrand(brandId, { title: values.title });
        if (updatedBrand) {
          form.reset();
          toast.success("Brand updated successfully!");
          router.push("/dashboard/brands");
        }
      }
    } catch (error) {
      console.error("Brand action failed", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Title" {...field} className="input-field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting
            ? "Submitting..."
            : type === "Create"
            ? "Create Brand"
            : "Update Brand"}
        </Button>
      </form>
    </Form>
  );
};

export default BrandForm;
