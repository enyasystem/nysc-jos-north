import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Upload, Palette, Type, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { insertUiSettingsSchema, type UiSettings, type InsertUiSettings } from "@shared/schema";
import { z } from "zod";

const uiSettingsFormSchema = insertUiSettingsSchema.extend({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  siteTitle: z.string().min(1, "Site title is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  contactEmail: z.string().email("Invalid email address"),
});

type UiSettingsFormData = z.infer<typeof uiSettingsFormSchema>;

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Nunito", label: "Nunito" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
];

export default function UiSettings() {
  const [previewColors, setPreviewColors] = useState({
    primary: "#006600",
    secondary: "#C3B091",
    accent: "#FFD700",
  });
  const { toast } = useToast();

  const { data: settings, isLoading, error } = useQuery<UiSettings>({
    queryKey: ["/api/ui-settings"],
  });

  const form = useForm<UiSettingsFormData>({
    resolver: zodResolver(uiSettingsFormSchema),
    defaultValues: {
      primaryColor: "#006600",
      secondaryColor: "#C3B091",
      accentColor: "#FFD700",
      logoUrl: "",
      siteTitle: "NYSC Jos North - Official Biodata Portal",
      siteDescription: "Official portal for NYSC Jos North operations and management",
      contactEmail: "contact@nyscjosnorth.gov.ng",
    },
  });

  // Update form when settings are loaded
  useState(() => {
    if (settings) {
      form.reset({
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        accentColor: settings.accentColor,
        logoUrl: settings.logoUrl || "",
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
      });
      setPreviewColors({
        primary: settings.primaryColor,
        secondary: settings.secondaryColor,
        accent: settings.accentColor,
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<UiSettingsFormData>) => {
      await apiRequest("PUT", "/api/ui-settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ui-settings"] });
      toast({
        title: "Success",
        description: "UI settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update UI settings",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: UiSettingsFormData) => {
    updateMutation.mutate(data);
  };

  const handleColorChange = (colorType: keyof typeof previewColors, value: string) => {
    setPreviewColors(prev => ({ ...prev, [colorType]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center" data-testid="ui-settings-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center" data-testid="ui-settings-error">
        <p className="text-destructive">Failed to load UI settings. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-8" data-testid="ui-settings">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">UI Settings</h1>
        <p className="text-emerald-100">Customize platform appearance and branding</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Theme Settings */}
            <Card className="shadow-lg" data-testid="theme-settings-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold">Theme Settings</h3>
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg border border-border"
                            style={{ backgroundColor: previewColors.primary }}
                          />
                          <FormControl>
                            <Input 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handleColorChange('primary', e.target.value);
                              }}
                              data-testid="input-primary-color"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secondaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Color</FormLabel>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg border border-border"
                            style={{ backgroundColor: previewColors.secondary }}
                          />
                          <FormControl>
                            <Input 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handleColorChange('secondary', e.target.value);
                              }}
                              data-testid="input-secondary-color"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accentColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accent Color</FormLabel>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg border border-border"
                            style={{ backgroundColor: previewColors.accent }}
                          />
                          <FormControl>
                            <Input 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handleColorChange('accent', e.target.value);
                              }}
                              data-testid="input-accent-color"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo Settings */}
            <Card className="shadow-lg" data-testid="logo-settings-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold">Logo & Branding</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Logo</label>
                    <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center">
                      {settings?.logoUrl ? (
                        <img 
                          src={settings.logoUrl} 
                          alt="Platform Logo" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Globe className="w-10 h-10 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter logo URL" 
                            {...field}
                            value={field.value || ""}
                            data-testid="input-logo-url"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload New Logo</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 mx-auto text-emerald-100 mb-4" />
                      <p className="text-emerald-100 mb-2">Drag & drop or click to upload</p>
                      <Button type="button" variant="outline" data-testid="button-choose-file">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography Settings */}
            <Card className="shadow-lg" data-testid="typography-settings-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Type className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold">Typography</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Font</label>
                    <Select defaultValue="Inter">
                      <SelectTrigger data-testid="select-primary-font">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Heading Font</label>
                    <Select defaultValue="Inter">
                      <SelectTrigger data-testid="select-heading-font">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Settings */}
            <Card className="shadow-lg" data-testid="content-settings-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold">Content Settings</h3>
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="siteTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Title</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-site-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} data-testid="input-site-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="input-contact-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Color Preview Section */}
          <Card className="shadow-lg" data-testid="color-preview-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-6">Color Preview</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button 
                    style={{ backgroundColor: previewColors.primary }}
                    className="text-white"
                    data-testid="preview-primary-button"
                  >
                    Primary Button
                  </Button>
                  <Button 
                    style={{ backgroundColor: previewColors.secondary }}
                    className="text-white"
                    data-testid="preview-secondary-button"
                  >
                    Secondary Button
                  </Button>
                  <Button 
                    style={{ backgroundColor: previewColors.accent }}
                    className="text-white"
                    data-testid="preview-accent-button"
                  >
                    Accent Button
                  </Button>
                </div>
                <div className="p-4 border border-border rounded-lg bg-white/3 text-white">
                  <h4 className="font-semibold mb-2" style={{ color: previewColors.primary }}>
                    Sample Heading with Primary Color
                  </h4>
                  <p className="text-emerald-100">
                    This is how your content will look with the selected color scheme.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button 
              type="submit"
              size="lg"
              disabled={updateMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-save-ui-settings"
            >
              {updateMutation.isPending ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
