"use client";  // Add client directive to resolve hydration issues

import React, { useState, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

// Validation Schema
const profileFormSchema = z.object({
  avatar: z.any().optional(), // Changed to accept file object
  fullName: z.string()
    .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
    .max(50, { message: "Tên không được vượt quá 50 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 
    { message: "Số điện thoại không hợp lệ" }),
  dateOfBirth: z.date().optional(),
  username: z.string()
    .min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" })
    .max(20, { message: "Tên đăng nhập không được vượt quá 20 ký tự" }),
  description: z.string()
    .max(500, { message: "Mô tả không được vượt quá 500 ký tự" })
    .optional(),
  password: z.string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    { message: "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt" })
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Home() {
  
  // Default form values
  const defaultValues: Partial<ProfileFormValues> = {
    avatar: undefined,
    fullName: '',
    email: '',
    phone: '',
    username: '',
    description: '',
    dateOfBirth: undefined,
    password: '',
  };
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize the form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      
      // Update the form value
      form.setValue("avatar", file);
    }
  };

  // Handle clicking on the avatar to trigger file selection
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Form submission handler
  function onSubmit(data: ProfileFormValues) {
    try {
      // Here you would typically send the data to your backend
      // For file uploads, you'd likely use FormData
      const formData = new FormData();
      
      if (data.avatar && data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
      }
      
      // Append other form fields
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("username", data.username);
      if (data.description) formData.append("description", data.description);
      if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth.toISOString());
      formData.append("password", data.password);
      
      // Log the FormData (in a real app, you'd send this to your server)
      console.log("Form data to be submitted:", data);
      console.log("Avatar file:", data.avatar);
      
      toast("Hồ sơ của bạn đã được cập nhật", {
        description: "Thông tin đã được lưu thành công.",
      });
    } catch (error) {
      toast("Lỗi", {
        description: "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
      });
    }
  }

  return (
    <div className="w-full mx-auto p-6 bg-white flex justify-center items-center h-full max-h-[90%] overflow-hidden">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Chỉnh sửa hồ sơ cá nhân</CardTitle>
          <CardDescription>Cập nhật thông tin của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full h-full">
              {/* Layout container - use grid instead of flex with w-1/2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column - form fields */}
                <div className="space-y-4">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập họ và tên" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Nhập địa chỉ email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="Nhập số điện thoại" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date of Birth */}
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày sinh</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  "Chọn ngày sinh"
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên đăng nhập" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Nhập mật khẩu mới" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          <span className="text-xs italic text-slate-400">Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Right column - description, password, and avatar */}
                <div className="space-y-4">
                  {/* Avatar Upload */}
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="flex flex-col items-center space-y-4">
                        <div 
                          onClick={handleAvatarClick} 
                          className="relative cursor-pointer group"
                        >
                          <Avatar className="w-48 h-48">
                            {avatarPreview ? (
                              <AvatarImage 
                                src={avatarPreview} 
                                alt="Avatar" 
                                className="object-cover"
                              />
                            ) : (
                              <AvatarFallback>CN</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        
                        <FormControl>
                          <input 
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            {...field} ref={fileInputRef}
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleAvatarClick}
                        >
                          Chọn ảnh đại diện
                        </Button>
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
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl className='h-40'>
                          <Textarea
                            placeholder="Viết một vài dòng giới thiệu về bạn"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Cập nhật Hồ sơ
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}