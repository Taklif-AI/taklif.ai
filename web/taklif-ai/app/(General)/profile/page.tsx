"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Book, Download, User } from "lucide-react";

export default function ProfilePage() {
  const [image, setImage] = useState<string>("/placeholder.jpg");
  const [credits] = useState(100);
  const [assignments] = useState(24);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-purple-900 to-purple-700 rounded-lg">
          <div className="absolute bottom-[50px]	 left-8 flex items-end space-x-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={image} alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <label htmlFor="avatar-upload" className="absolute -right-2 -bottom-2">
                <div className="rounded-full bg-primary p-2 cursor-pointer hover:bg-primary/90">
                  <Download className="w-4 h-4 text-primary-foreground" />
                </div>
              </label>
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-white">John Doe</h1>
              <p className="text-purple-200">Credits left: {credits}</p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="mt-16">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Book className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-2xl font-bold">{assignments}</p>
                <p className="text-muted-foreground">Assignments Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex-1">
              <User className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input id="institution" defaultValue="University of Technology" />
              </div>
              <Button className="w-fit bg-purple-600 hover:bg-purple-700 text-white">
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6 space-y-6">
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="w-fit bg-purple-600 hover:bg-purple-700 text-white">
                Update Password
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}