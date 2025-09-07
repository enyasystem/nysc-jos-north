import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Event } from "@shared/schema";

const categoryColors = {
  "Community Service": "bg-primary/10 text-primary",
  "Training": "bg-accent/10 text-accent-foreground",
  "Cultural": "bg-secondary/10 text-secondary-foreground",
  "Healthcare": "bg-green-100 text-green-700",
  "Education": "bg-blue-100 text-blue-700",
  "Environment": "bg-emerald-100 text-emerald-700",
};

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Events");

  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const categories = ["All Events", "Community Service", "Training", "Cultural", "Healthcare", "Education", "Environment"];

  const filteredEvents = events?.filter(event => 
    selectedCategory === "All Events" || event.category === selectedCategory
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="events-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="events-error">
        <p className="text-destructive">Failed to load events. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-muted" data-testid="events-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="events-title">
            Upcoming <span className="text-gradient">Events</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="events-description">
            Stay updated with all NYSC Jos North activities, community development programs, and social events
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12" data-testid="event-filters">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-primary text-primary-foreground" : ""}
              data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {category}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20" data-testid="no-events">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Events Found</h3>
            <p className="text-muted-foreground">
              {selectedCategory === "All Events" 
                ? "There are no events available at the moment." 
                : `No events found in the "${selectedCategory}" category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden shadow-lg hover-lift" data-testid={`event-card-${event.id}`}>
                {event.imageUrl && (
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      className={categoryColors[event.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700"}
                      data-testid={`event-category-${event.id}`}
                    >
                      {event.category}
                    </Badge>
                    <span className="text-muted-foreground text-sm" data-testid={`event-date-${event.id}`}>
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3" data-testid={`event-title-${event.id}`}>
                    {event.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4" data-testid={`event-description-${event.id}`}>
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      <span data-testid={`event-time-${event.id}`}>{event.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span data-testid={`event-location-${event.id}`}>{event.location}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid={`button-register-${event.id}`}
                  >
                    Register
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View All Events Button */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-4"
              data-testid="button-view-all-events"
            >
              <Calendar className="w-5 h-5 mr-3" />
              View All Events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
