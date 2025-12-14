"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createAdmin } from "@/lib/actions/admin.actions";
import Select from "react-select";

export const adminFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  role: z.string().min(3, "Role must be at least 3 characters."),
});

const AdminForm = ({ userId, type }: { userId: string; type: "Create" }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Moderator",
    },
  });

  async function onSubmit(values: z.infer<typeof adminFormSchema>) {
    try {
      if (type === "Create" && userId) {
        const newAdmin = await createAdmin({
          Name: values.name,
          Email: values.email,
          Role: values.role,
        });

        if (newAdmin) {
          form.reset();
          router.push(`/dashboard/admins`);
        }
      }
    } catch (error) {
      console.error("Admin creation failed", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Name" {...field} className="input-field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Email" {...field} className="input-field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SubCategory */}
        <FormItem>
          <FormLabel>Role</FormLabel>
          <FormControl>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => {
                const options = [
                  { label: "Admin", value: "Admin" },
                  { label: "Moderator", value: "Moderator" },
                ];

                return (
                  <Select
                    options={options}
                    isSearchable
                    value={
                      options.find((opt) => opt.value === field.value) || null
                    }
                    onChange={(selected) =>
                      field.onChange(selected?.value || "")
                    }
                    placeholder="Select subcategory"
                    classNamePrefix="react-select"
                  />
                );
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : "Create Admin"}
        </Button>
      </form>
    </Form>
  );
};

export default AdminForm;
