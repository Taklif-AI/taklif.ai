"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { User, Settings, Bell, BookOpen, Shield, Upload, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [notifications, setNotifications] = useState({
    email: true,
    assignments: true,
    updates: false,
    reminders: true
  });

  const stats = [
    { label: "Assignments Created", value: "24", icon: BookOpen },
    { label: "Completion Rate", value: "92%", icon: Sparkles },
    { label: "Active Streak", value: "7 days", icon: Shield }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="p-8 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-background">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-violet-200 dark:bg-violet-800 rounded-full blur-lg opacity-20"></div>
              </div>
              <Button size="sm" variant="outline" className="absolute bottom-0 right-0">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">John Doe</h1>
              <p className="text-muted-foreground mb-4">Educational Technology Enthusiast</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary">Premium Member</Badge>
                <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100">
                  Teacher
                </Badge>
                <Badge variant="outline">Computer Science</Badge>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-background">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-100 dark:bg-violet-900 rounded-lg">
                  <stat.icon className="h-6 w-6 text-violet-600 dark:text-violet-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Settings Tabs */}
        <Card className="p-8">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" className="bg-violet-50/50 dark:bg-violet-950/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" className="bg-violet-50/50 dark:bg-violet-950/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input id="institution" defaultValue="University of Technology" className="bg-violet-50/50 dark:bg-violet-950/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio" 
                    rows={4}
                    className="w-full p-2 rounded-md border bg-violet-50/50 dark:bg-violet-950/20"
                    defaultValue="Passionate educator focused on integrating technology in learning."
                  />
                </div>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700">Save Changes</Button>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-violet-50/50 dark:bg-violet-950/20">
                  <div className="space-y-0.5">
                    <Label>Default Assignment Difficulty</Label>
                    <p className="text-sm text-muted-foreground">
                      Set your preferred difficulty level
                    </p>
                  </div>
                  <select className="p-2 rounded-md border bg-white dark:bg-gray-800">
                    <option>Basic</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-violet-50/50 dark:bg-violet-950/20">
                  <div className="space-y-0.5">
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred language
                    </p>
                  </div>
                  <select className="p-2 rounded-md border bg-white dark:bg-gray-800">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-violet-50/50 dark:bg-violet-950/20">
                  <div className="space-y-0.5">
                    <Label>Time Zone</Label>
                    <p className="text-sm text-muted-foreground">
                      Set your local time zone
                    </p>
                  </div>
                  <select className="p-2 rounded-md border bg-white dark:bg-gray-800">
                    <option>UTC-5 (Eastern)</option>
                    <option>UTC-8 (Pacific)</option>
                    <option>UTC+0 (London)</option>
                  </select>
                </div>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700">Save Preferences</Button>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="grid gap-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-violet-50/50 dark:bg-violet-950/20">
                    <div className="space-y-0.5">
                      <Label className="capitalize">{key} Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        {key === 'email' && 'Receive email updates about your assignments'}
                        {key === 'assignments' && 'Get notified when assignments are ready'}
                        {key === 'updates' && 'Stay informed about new features'}
                        {key === 'reminders' && 'Get reminders for pending assignments'}
                      </p>
                    </div>
                    <Switch 
                      checked={value}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700">Save Notification Settings</Button>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}