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
import { createCategory, updateCategory } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import toast from "react-hot-toast";

export const categoryFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
});

type CategoryFormProps = {
  type: "Create" | "Update";
  category?: ICategory;
  categoryId?: string;
};

const CategoryForm = ({ type, category, categoryId }: CategoryFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: category?.title || "",
    },
  });

  async function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    try {
      if (type === "Create") {
        const newCategory = await createCategory(values);
        if (newCategory) {
          form.reset();
          toast.success("Category created successfully!");
          router.push(`/dashboard/categories`);
        }
      } else if (type === "Update" && categoryId) {
        const updatedCategory = await updateCategory(categoryId, values);
        if (updatedCategory) {
          form.reset();
          toast.success("Category updated successfully!");
          router.push(`/dashboard/categories`);
        }
      }
    } catch (error) {
      console.error("Category action failed", error);
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
            ? "Create Category"
            : "Update Category"}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
