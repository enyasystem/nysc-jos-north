import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, FileText, Video, Image as ImageIcon, Download, Eye, Upload, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { insertResourceSchema, type Resource, type InsertResource } from "@shared/schema";
import { z } from "zod";

const resourceFormSchema = insertResourceSchema.extend({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  fileType: z.string().min(1, "File type is required"),
});

type ResourceFormData = z.infer<typeof resourceFormSchema>;

const categoryIcons = {
  Documents: FileText,
  Forms: FileText,
  Videos: Video,
  Images: ImageIcon,
};

const fileTypeColors = {
  PDF: "bg-red-100 text-red-600",
  DOC: "bg-blue-100 text-blue-600",
  DOCX: "bg-blue-100 text-blue-600",
  MP4: "bg-purple-100 text-purple-600",
  MOV: "bg-purple-100 text-purple-600",
  JPG: "bg-green-100 text-green-600",
  PNG: "bg-green-100 text-green-600",
  GIF: "bg-green-100 text-green-600",
};

export default function ResourcesManagement() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { toast } = useToast();

  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Documents",
      fileUrl: "",
      fileType: "PDF",
      fileSize: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ResourceFormData) => {
      await apiRequest("POST", "/api/resources", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      toast({
        title: "Success",
        description: "Resource uploaded successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload resource",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ResourceFormData> }) => {
      await apiRequest("PUT", `/api/resources/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      toast({
        title: "Success",
        description: "Resource updated successfully",
      });
      setIsDialogOpen(false);
      setSelectedResource(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    },
  });

  const categories = ["All Categories", "Documents", "Forms", "Videos", "Images"];

  const filteredResources = resources?.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const resourceStats = {
    documents: resources?.filter(r => r.category === "Documents" || r.category === "Forms").length || 0,
    videos: resources?.filter(r => r.category === "Videos").length || 0,
    images: resources?.filter(r => r.category === "Images").length || 0,
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    form.reset({
      title: resource.title,
      description: resource.description || "",
      category: resource.category,
      fileUrl: resource.fileUrl || "",
      fileType: resource.fileType,
      fileSize: resource.fileSize || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: ResourceFormData) => {
    if (selectedResource) {
      updateMutation.mutate({ id: selectedResource.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center" data-testid="resources-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center" data-testid="resources-error">
        <p className="text-destructive">Failed to load resources. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-8" data-testid="resources-management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Manage Resources</h1>
          <p className="text-muted-foreground">Upload and organize platform resources</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-primary text-primary-foreground"
              onClick={() => {
                setSelectedResource(null);
                form.reset();
              }}
              data-testid="button-upload-resource"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" data-testid="resource-dialog">
            <DialogHeader>
              <DialogTitle>
                {selectedResource ? "Edit Resource" : "Upload New Resource"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter resource title" {...field} data-testid="input-resource-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter resource description" {...field} data-testid="input-resource-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-resource-category">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.slice(1).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fileType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-resource-file-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PDF">PDF</SelectItem>
                            <SelectItem value="DOC">DOC</SelectItem>
                            <SelectItem value="DOCX">DOCX</SelectItem>
                            <SelectItem value="MP4">MP4</SelectItem>
                            <SelectItem value="MOV">MOV</SelectItem>
                            <SelectItem value="JPG">JPG</SelectItem>
                            <SelectItem value="PNG">PNG</SelectItem>
                            <SelectItem value="GIF">GIF</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter file URL or upload path" {...field} data-testid="input-resource-file-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fileSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Size (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2.5 MB" {...field} data-testid="input-resource-file-size" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-resource"
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : null}
                    {selectedResource ? "Update Resource" : "Upload Resource"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel-resource"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resource Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center shadow-lg hover-lift" data-testid="documents-stats">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-2">Documents</h3>
          <p className="text-2xl font-bold text-primary mb-1">{resourceStats.documents}</p>
          <p className="text-sm text-muted-foreground">Total files</p>
        </Card>

        <Card className="p-6 text-center shadow-lg hover-lift" data-testid="videos-stats">
          <div className="w-16 h-16 bg-secondary/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">Videos</h3>
          <p className="text-2xl font-bold text-secondary-foreground mb-1">{resourceStats.videos}</p>
          <p className="text-sm text-muted-foreground">Training videos</p>
        </Card>

        <Card className="p-6 text-center shadow-lg hover-lift" data-testid="images-stats">
          <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-accent-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">Images</h3>
          <p className="text-2xl font-bold text-accent-foreground mb-1">{resourceStats.images}</p>
          <p className="text-sm text-muted-foreground">Gallery items</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-6 mb-8 shadow-lg" data-testid="resources-search-filter">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-resources-input"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48" data-testid="filter-resources-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Resources List */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-20" data-testid="no-resources">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Resources Found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== "All Categories" 
              ? "Try adjusting your search or filter criteria." 
              : "Start by uploading your first resource."}
          </p>
        </div>
      ) : (
        <Card className="p-6 shadow-lg" data-testid="resources-list">
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                data-testid={`resource-item-${resource.id}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    fileTypeColors[resource.fileType as keyof typeof fileTypeColors] || "bg-gray-100 text-gray-600"
                  }`}>
                    {resource.fileType === "MP4" || resource.fileType === "MOV" ? (
                      <Video className="w-5 h-5" />
                    ) : resource.fileType === "JPG" || resource.fileType === "PNG" || resource.fileType === "GIF" ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium" data-testid={`resource-title-${resource.id}`}>
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`resource-meta-${resource.id}`}>
                      {resource.fileType} {resource.fileSize && `• ${resource.fileSize}`} • {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                    data-testid={`button-view-${resource.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20"
                    onClick={() => handleEdit(resource)}
                    data-testid={`button-edit-${resource.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-50 text-red-600 hover:bg-red-100"
                    onClick={() => handleDelete(resource.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${resource.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
