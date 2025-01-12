"use client";

import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Book, Download, User } from "lucide-react";
import { profile } from "@/actions/profile";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { settings } from "@/actions/settings";

export default function ProfilePage() {
  const { update } = useSession();
  const user = useCurrentUser();
  const [image, setImage] = useState<string>("/placeholder.jpg");
  const [credits] = useState(100);
  const [assignments] = useState(24);
  const [isPending, startTransition] = useTransition();
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || undefined,
    email: user?.email || undefined,
    institution: user?.institution || ''
  });
  const [settingsFormData, setSettingsFormData] = useState({
    password: undefined,
    newPassword: undefined,
    isTwoFactorEnabled: user?.isTwoFactorEnabled,
  });

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    startTransition(() => {
      profile(profileFormData)
        .then((data) => {
          if (data.error) {
            setError(data.error)
          }

          if (data.success) {
            update();
            setSuccess(data.success)
          }
        })
        .catch(() => setError("Something went wrong!"))
    })
  }

  const submitSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    startTransition(() => {
      settings(settingsFormData)
        .then((data) => {
          if (data.error) {
            setError(data.error)
          }

          if (data.success) {
            update();
            setSuccess(data.success)
          }
        })
        .catch(() => setError("Something went wrong!"))
    })
  }

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
            {user?.isOAuth === false && (
              <TabsTrigger value="settings" className="flex-1">
                <User className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            )}
          </TabsList>
          {/* ************************************************************* */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <form method="POST" onSubmit={submitProfile}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input disabled={isPending} onChange={handleProfileChange} id="name" name="name" value={profileFormData.name} />
                </div>
                {user?.isOAuth == false && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input disabled={isPending} onChange={handleProfileChange} id="email" name="email" type="email" value={profileFormData.email} />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input disabled={isPending} onChange={handleProfileChange} id="institution" name="institution" value={profileFormData.institution} />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button disabled={isPending} type="submit" className="w-fit bg-purple-600 hover:bg-purple-700 text-white">
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>
          {/* ************************************************** */}
          {user?.isOAuth === false && (
            <TabsContent value="settings" className="mt-6 space-y-6">
              <form onSubmit={submitSettings}>
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Two Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={settingsFormData.isTwoFactorEnabled}
                      disabled={isPending}
                      name="isTwoFactorEnabled"
                      onCheckedChange={() => setSettingsFormData((prev) => ({ ...prev, 'isTwoFactorEnabled': !settingsFormData.isTwoFactorEnabled }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Current Password</Label>
                    <Input disabled={isPending} id="password" onChange={handleSettingsChange} name="password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input disabled={isPending} id="newPassword" onChange={handleSettingsChange} name="newPassword" type="password" />
                  </div>
                  <FormError message={error} />
                  <FormSuccess message={success} />
                  <Button disabled={isPending} className="w-fit bg-purple-600 hover:bg-purple-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </form>
            </TabsContent>
          )}

          {/* *************************************************** */}
        </Tabs>
      </div>
    </div>
  );
}