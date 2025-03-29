"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Clock,
  LogOut,
  Settings,
  Search,
  Info,
  LineChart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("Thông tin cá nhân");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Menu items
  const menuItems = [
    { title: "Thông tin cá nhân", icon: Home, badge: null },
    { title: "Thời khóa biểu", icon: Clock, badge: 123 },
    { title: "Lịch sử giao dịch", icon: LineChart, badge: null },
    { title: "Điều khoản dịch vụ", icon: Info, badge: null },
    { title: "Đăng xuất", icon: LogOut, badge: null },
  ];

  if (!isClient) return null; // Tránh render trên server để tránh lỗi hydration

  return (
    <Sidebar className="w-64 h-screen bg-gradient-to-b from-orange-100 to-orange-50 border-r-0">
      <SidebarContent className="px-4 py-4">
        {/* Header with profile and settings */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src="/api/placeholder/40/40" alt="Profile" />
              <AvatarFallback>HN</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="text-xs text-gray-500">Welcome back,</div>
              <div className="font-semibold text-gray-700">Hùng</div>
            </div>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-white shadow-sm">
            <Settings className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-purple-400" />
          </div>
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 rounded-full border-none bg-white h-9"
          />
        </div>

        {/* Menu items */}
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <SidebarMenuItem
              key={index}
              className={`flex justify-between items-center px-3 py-3 rounded-xl transition-colors cursor-pointer ${
                activeItem === item.title ? "bg-white shadow-sm" : "hover:bg-white/60"
              }`}
              onClick={() => setActiveItem(item.title)}
            >
              <div className="flex items-center">
                <item.icon
                  className={`h-5 w-5 ${
                    activeItem === item.title ? "text-gray-700" : "text-gray-500"
                  }`} 
                />
                <span
                  className={`ml-3 text-sm ${
                    activeItem === item.title ? "font-medium text-gray-700" : "text-gray-600"
                  }`}
                >
                  {item.title}
                </span>
              </div>
              <div className="flex items-center">
                {item.badge && (
                  <Badge variant="secondary" className="bg-pink-500 text-white hover:bg-pink-500 mr-2">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </SidebarMenuItem>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
