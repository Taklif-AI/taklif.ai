"use client";

import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Book, Coins, Moon, Sun, Upload, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/actions/profile";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { settings } from "@/actions/settings";
import { Toast } from "@/lib/utils/toast";
import { uploadImage } from "@/actions/upload-image";
import { useAssignments } from "@/components/providers/assignments-provider";
import { useTheme } from "next-themes";

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export default function ProfilePage() {
  const { update } = useSession();
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const { count } = useAssignments();
  const { theme, setTheme } = useTheme();

  const [planCredits] = useState<number>(user?.plan_credits);
  const [remainingCredits] = useState<number>(user?.remaining_credits);

  const creditsColorClass =
    remainingCredits < 10
      ? "text-red-500"
      : remainingCredits < 30
        ? "text-orange-500"
        : "text-green-600";

  const subscriptionDate = user?.subscription_date
    ? new Date(user.subscription_date)
    : new Date(); // fallback to now
  const renewalDate = addDays(subscriptionDate, 30);

  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || undefined,
    email: user?.email || undefined,
    institution: user?.institution || "",
  });
  const [settingsFormData, setSettingsFormData] = useState({
    password: undefined,
    newPassword: undefined,
    isTwoFactorEnabled: user?.isTwoFactorEnabled,
    theme: user?.theme || "dark",
  });

  const [image, setImage] = useState(user?.image || "/default-avatar.jpg");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const cropImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas size to the crop size
          canvas.width = 250;
          canvas.height = 250;

          // Calculate cropping dimensions
          const cropSize = Math.min(img.width, img.height);
          const cropX = (img.width - cropSize) / 2;
          const cropY = (img.height - cropSize) / 2;

          // Draw cropped image to canvas
          if (ctx) {
            ctx.drawImage(
              img,
              cropX,
              cropY,
              cropSize,
              cropSize,
              0,
              0,
              250,
              250,
            );
          }

          // Convert canvas to Blob
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas is empty"));
          }, file.type);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate the selected file
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
    ];
    if (!validImageTypes.includes(file.type)) {
      Toast.error("Only images are allowed!");
      return;
    }

    const croppedImageBlob = await cropImage(file);
    startTransition(() => {
      uploadImage(file.name, croppedImageBlob.type)
        .then(async (data) => {
          if (data.error) {
            Toast.error(data.error);
            return;
          }

          if (data.fields && data.url && data.s3Key && data.imageUrl) {
            update({
              user: {
                image: data.imageUrl,
              },
            });

            // Upload the image to S3
            const formData = new FormData();
            Object.entries(data.fields).forEach(([key, value]) => {
              formData.append(key, value as string);
            });
            formData.append("file", croppedImageBlob);

            const uploadResponse = await fetch(data.url, {
              method: "POST",
              body: formData,
            });

            if (!uploadResponse.ok) {
              Toast.error("Failed to upload image!2");
              return;
            }
            setImage(data.imageUrl);
            update({
              image: data.imageUrl,
            });
            Toast.success("Image uploaded successfully");
          }
        })
        .catch(() => Toast.error("Failed to upload image!2"));
    });
  };

  const handleProfileChange = async (e) => {
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
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  const submitSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    startTransition(() => {
      settings(settingsFormData)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            setTheme(settingsFormData.theme);
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-b from-purple-900/50 to-transparent dark:from-purple-900/50 rounded-lg">
          <div className="absolute bottom-[50px]	 left-8 flex items-end space-x-4">
            <div className="relative  ">
              <div className=" inset-0 rounded-full transition-opacity duration-300 before:absolute before:inset-0 before:rounded-full before:blur-lg before:bg-purple-500/50">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={image}
                    alt="Profile Image"
                    width={50}
                    height={50}
                  />
                  <AvatarFallback style={{ fontFamily: "Noto Color Emoji" }}>
                    ⚙️
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute -right-2 -bottom-2"
                >
                  <div className="rounded-full bg-primary p-2 cursor-pointer hover:bg-primary/90">
                    <Upload className="w-4 h-4 text-primary-foreground" />
                  </div>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <h1 className="text-2xl font-bold text-gray dark:text-white">
                  {user?.name}
                </h1>
                {/* Plan Badge */}
                <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100 pointer-events-none">
                  {user?.plan
                    ?.split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}{" "}
                  Member
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-purple-800 dark:text-purple-200" />
                <span className="font-semibold">
                  <span className={`${creditsColorClass} font-semibold`}>
                    {remainingCredits}
                  </span>
                  <span className="text-purple-800 dark:text-purple-200">
                    {" "}
                    / {planCredits} Credits
                  </span>
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Credits renew on{" "}
                {renewalDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
              </p>
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
                <p className="text-2xl font-bold">{count}</p>
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
            <TabsTrigger value="settings" className="flex-1">
              <User className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <form method="POST" onSubmit={submitProfile}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    disabled={isPending}
                    onChange={handleProfileChange}
                    id="name"
                    name="name"
                    value={profileFormData.name}
                  />
                </div>
                {user?.isOAuth == false && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      disabled={isPending}
                      onChange={handleProfileChange}
                      id="email"
                      name="email"
                      type="email"
                      value={profileFormData.email}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    disabled={isPending}
                    onChange={handleProfileChange}
                    id="institution"
                    name="institution"
                    value={profileFormData.institution}
                  />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-fit bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6 space-y-6">
            <form onSubmit={submitSettings}>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Theme Preference</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred theme.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => {
                        setSettingsFormData((prev) => ({
                          ...prev,
                          theme: "light",
                        }));
                      }}
                    >
                      <Sun className="w-5 h-5" />
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => {
                        setSettingsFormData((prev) => ({
                          ...prev,
                          theme: "dark",
                        }));
                      }}
                    >
                      <Moon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                {user?.isOAuth === false && (
                  <>
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
                        onCheckedChange={() =>
                          setSettingsFormData((prev) => ({
                            ...prev,
                            isTwoFactorEnabled:
                              !settingsFormData.isTwoFactorEnabled,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Current Password</Label>
                      <Input
                        disabled={isPending}
                        id="password"
                        onChange={handleSettingsChange}
                        name="password"
                        type="password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        disabled={isPending}
                        id="newPassword"
                        onChange={handleSettingsChange}
                        name="newPassword"
                        type="password"
                      />
                    </div>
                  </>
                )}
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button
                  disabled={isPending}
                  className="w-fit bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
