import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Code, Mail, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Developer } from "@shared/schema";

export default function DevelopersManagement() {
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const { toast } = useToast();

  const { data: developers, isLoading, error } = useQuery<Developer[]>({
    queryKey: ["/api/developers"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/developers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/developers"] });
      toast({
        title: "Success",
        description: "Developer deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete developer",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center" data-testid="developers-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center" data-testid="developers-error">
        <p className="text-destructive">Failed to load developers. Please try again later.</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this developer?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-8" data-testid="developers-management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Manage Developers</h1>
          <p className="text-muted-foreground">Manage platform development team members</p>
        </div>
        <Button className="bg-primary text-primary-foreground" data-testid="button-add-developer">
          <Plus className="w-4 h-4 mr-2" />
          Add Developer
        </Button>
      </div>

      {!developers || developers.length === 0 ? (
        <div className="text-center py-20" data-testid="no-developers">
          <Code className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Developers Found</h3>
          <p className="text-muted-foreground">Start by adding your first development team member.</p>
        </div>
      ) : (
        <Card className="shadow-lg overflow-hidden" data-testid="developers-table">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Developer</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">Skills</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {developers.map((developer) => (
                    <tr 
                      key={developer.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                      data-testid={`developer-row-${developer.id}`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {developer.imageUrl ? (
                            <img 
                              src={developer.imageUrl} 
                              alt={developer.name}
                              className="w-10 h-10 rounded-full object-cover"
                              data-testid={`developer-image-${developer.id}`}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Code className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium" data-testid={`developer-name-${developer.id}`}>
                              {developer.name}
                            </p>
                            <p className="text-sm text-muted-foreground" data-testid={`developer-email-${developer.id}`}>
                              {developer.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4" data-testid={`developer-role-${developer.id}`}>
                        {developer.role}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1 flex-wrap" data-testid={`developer-skills-${developer.id}`}>
                          {developer.skills?.slice(0, 2).map((skill) => (
                            <Badge 
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {(developer.skills?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(developer.skills?.length || 0) - 2} more
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          className={
                            developer.status === "active" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }
                          data-testid={`developer-status-${developer.id}`}
                        >
                          {developer.status === "active" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {developer.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20"
                            onClick={() => setSelectedDeveloper(developer)}
                            data-testid={`button-edit-${developer.id}`}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 text-red-600 hover:bg-red-100"
                            onClick={() => handleDelete(developer.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${developer.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
