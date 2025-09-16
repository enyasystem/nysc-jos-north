import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Users, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Exco } from "@shared/schema";

export default function ExcosManagement() {
  const [selectedExco, setSelectedExco] = useState<Exco | null>(null);
  const { toast } = useToast();

  const { data: excos, isLoading, error } = useQuery<Exco[]>({
    queryKey: ["/api/excos"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/excos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/excos"] });
      toast({
        title: "Success",
        description: "Exco deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete exco",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center" data-testid="excos-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center" data-testid="excos-error">
        <p className="text-destructive">Failed to load excos. Please try again later.</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this exco?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-8" data-testid="excos-management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Excos</h1>
          <p className="text-emerald-100">Add, edit, or remove executive members</p>
        </div>
        <Button className="bg-primary text-primary-foreground" data-testid="button-add-exco">
          <Plus className="w-4 h-4 mr-2" />
          Add New Exco
        </Button>
      </div>

      {!excos || excos.length === 0 ? (
        <div className="text-center py-20" data-testid="no-excos">
          <Users className="w-16 h-16 text-emerald-100 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Excos Found</h3>
          <p className="text-emerald-100">Start by adding your first executive member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {excos.map((exco) => (
            <Card key={exco.id} className="shadow-lg hover-lift" data-testid={`exco-card-${exco.id}`}>
              <CardContent className="p-6">
                {exco.imageUrl && (
                  <img 
                    src={exco.imageUrl} 
                    alt={exco.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    data-testid={`exco-image-${exco.id}`}
                  />
                )}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold" data-testid={`exco-name-${exco.id}`}>
                    {exco.name}
                  </h3>
                  <p className="text-primary font-medium" data-testid={`exco-position-${exco.id}`}>
                    {exco.position}
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-emerald-100">
                    {exco.email && (
                      <div className="flex items-center justify-center space-x-1" data-testid={`exco-email-${exco.id}`}>
                        <Mail className="w-3 h-3" />
                        <span>{exco.email}</span>
                      </div>
                    )}
                    {exco.phone && (
                      <div className="flex items-center justify-center space-x-1" data-testid={`exco-phone-${exco.id}`}>
                        <Phone className="w-3 h-3" />
                        <span>{exco.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20"
                    onClick={() => setSelectedExco(exco)}
                    data-testid={`button-edit-${exco.id}`}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100"
                    onClick={() => handleDelete(exco.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${exco.id}`}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    {deleteMutation.isPending ? "Deleting..." : "Remove"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
