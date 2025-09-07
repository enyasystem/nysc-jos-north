import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Download, 
  Eye, 
  Play,
  ExternalLink,
  Calculator,
  Calendar,
  FolderOutput,
  MessageCircle,
  Search,
  Filter,
  Globe,
  Mail,
  HelpCircle,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Resource } from "@shared/schema";

const categoryIcons = {
  Documents: FileText,
  Forms: FileText,
  Videos: Video,
  Images: ImageIcon,
};

const fileTypeColors = {
  PDF: "bg-red-100 text-red-600",
  DOC: "bg-blue-100 text-blue-600",
  MP4: "bg-purple-100 text-purple-600",
  JPG: "bg-green-100 text-green-600",
  PNG: "bg-green-100 text-green-600",
};

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
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

  const digitalTools = [
    {
      icon: Calculator,
      title: "Allowance Calculator",
      description: "Calculate your monthly allowance and deductions",
      action: "Calculate",
    },
    {
      icon: Calendar,
      title: "Service Year Timeline",
      description: "Track your service year progress and milestones",
      action: "View Timeline",
    },
    {
      icon: FolderOutput,
      title: "Document Generator",
      description: "Generate official documents and forms",
      action: "Generate",
    },
  ];

  const quickLinks = [
    { icon: Globe, title: "NYSC Portal", description: "Official NYSC website" },
    { icon: Mail, title: "Email Support", description: "Contact support team" },
    { icon: HelpCircle, title: "FAQ", description: "Frequently asked questions" },
    { icon: Phone, title: "Contact", description: "Emergency contacts" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="resources-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="resources-error">
        <p className="text-destructive">Failed to load resources. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-muted" data-testid="resources-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="resources-title">
            Available <span className="text-gradient">Resources</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="resources-description">
            Access essential documents, forms, and information resources for your NYSC service year
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-12 shadow-lg" data-testid="search-filter-card">
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
                  data-testid="search-input"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48" data-testid="category-filter">
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
              <Button 
                className="bg-primary text-primary-foreground"
                data-testid="search-button"
              >
                <Filter className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Resource Categories Overview */}
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

        {/* Resources List */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-20" data-testid="no-resources">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Resources Found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "All Categories" 
                ? "Try adjusting your search or filter criteria." 
                : "There are no resources available at the moment."}
            </p>
          </div>
        ) : (
          <Card className="p-6 shadow-lg mb-12" data-testid="resources-list">
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
                      {resource.fileType === "MP4" ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium" data-testid={`resource-title-${resource.id}`}>
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid={`resource-meta-${resource.id}`}>
                        {resource.fileType} • {resource.fileSize} • {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'Unknown date'}
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
                      {resource.fileType === "MP4" ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20"
                      data-testid={`button-download-${resource.id}`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Digital Tools */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center" data-testid="digital-tools-title">
            Digital Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {digitalTools.map((tool) => (
              <Card key={tool.title} className="p-6 shadow-lg hover-lift" data-testid={`digital-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <tool.icon className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{tool.title}</h3>
                <p className="text-muted-foreground mb-6">{tool.description}</p>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {tool.action}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-white" data-testid="quick-links-section">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Access Links</h2>
            <p className="text-white/90">Frequently accessed resources and external links</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <div
                key={link.title}
                className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-all duration-300 card-hover cursor-pointer"
                data-testid={`quick-link-${link.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <link.icon className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">{link.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
