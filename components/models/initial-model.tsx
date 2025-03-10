"use client";
import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/file-uploader";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Введите имя сервера",
  }),
  imageUrl: z.string().min(1, {
    message: "Загрузите фотографию для сервера",
  }),
});

const InitialModel = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="p-0 bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Создайте свой сервер
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Напишите имя сервера и загрузите фотографию для него
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-6 space-y-8">
              <div className="flex items-center justify-center relative">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <FileUploader
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                        Введите название сервера
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-300/50 border-none"
                          placeholder="Ввдите название сервера"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                className="cursor-pointer"
                variant="primary"
                disabled={isLoading}
              >
                Создать сервер
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialModel;
