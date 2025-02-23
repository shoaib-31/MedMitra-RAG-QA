"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  link: z.string().url("Invalid URL"),
  file: z.instanceof(File, { message: "A file is required" }),
});

type FormSchema = z.infer<typeof formSchema>;

const Page: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      link: "",
      file: undefined,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("link", data.link);
    formData.append("file", data.file);

    try {
      const serverURL =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const response = await axios.post(`${serverURL}/ingest`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      form.reset();
    } catch (error: any) {
      toast.error(
        "Error uploading file: " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#f4f8fb] rounded-2xl font-montserrat flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
          <CardHeader className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <UploadCloud size={32} className="text-[#4A90E2]" />
            </motion.div>
            <CardTitle className="text-[#008080]">
              Upload Medical Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#4A90E2]">Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter document title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#4A90E2]">Author</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter author's name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#4A90E2]">
                        Reference Link
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter reference link" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#4A90E2]">
                        Upload File
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            field.onChange(
                              e.target.files ? e.target.files[0] : null
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-[#32A852] hover:bg-[#008080] text-white font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Submit Document"}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;
