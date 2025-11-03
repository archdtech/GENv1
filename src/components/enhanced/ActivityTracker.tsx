"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Plus, 
  Target, 
  Clock,
  Flame,
  TrendingUp,
  Heart,
  Zap,
  Calendar,
  Award
} from "lucide-react";

interface Activity {
  id: string;
  activityType: string;
  duration: number;
  intensity: string;
  description?: string;
  calories: number;
  feedback: string;
  createdAt: string;
}

interface ActivityTrackerProps {
  userId: string;
}

export default function ActivityTracker({ userId }: ActivityTrackerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLogging, setIsLogging] = useState(false);

  // Mock activities data
  const mockActivities: Activity[] = [
    {
      id: "1",
      activityType: "cardio",
      duration: 30,
      intensity: "moderate",
      description: "Morning run in the park",
      calories: 280,
      feedback: "Excellent cardio session! Your DNA profile shows great cardiovascular adaptation.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: "2",
      activityType: "strength",
      duration: 45,
      intensity: "high",
      description: "Full body strength training",
      calories: 320,
      feedback: "Intense strength training! Your power-oriented muscle type is responding well.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: "3",
      activityType: "flexibility",
      duration: 20,
      intensity: "low",
      description: "Evening yoga session",
      calories: 80,
      feedback: "Great flexibility work! Your joints benefit from regular stretching.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    }
  ];

  useState(() => {
    setActivities(mockActivities);
  });

  const activityTypes = [
    { id: "cardio", name: "Cardio", icon: Heart, color: "text-red-500", description: "Running, cycling, swimming" },
    { id: "strength", name: "Strength", icon: Zap, color: "text-purple-500", description: "Weight training, resistance" },
    { id: "flexibility", name: "Flexibility", icon: Activity, color: "text-blue-500", description: "Yoga, stretching, mobility" },
    { id: "balance", name: "Balance", icon: Target, color: "text-green-500", description: "Pilates, stability work" }
  ];

  const intensityLevels = [
    { level: "low", label: "Low", color: "bg-green-500", description: "Light activity" },
    { level: "moderate", label: "Moderate", color: "bg-yellow-500", description: "Moderate effort" },
    { level: "high", label: "High", color: "bg-red-500", description: "High intensity" }
  ];

  const getActivityIcon = (type: string) => {
    const activity = activityTypes.find(a => a.id === type);
    return activity ? activity.icon : Activity;
  };

  const getActivityColor = (type: string) => {
    const activity = activityTypes.find(a => a.id === type);
    return activity ? activity.color : "text-gray-500";
  };

  const getIntensityColor = (intensity: string) => {
    const level = intensityLevels.find(l => l.level === intensity);
    return level ? level.color : "bg-gray-500";
  };

  const calculateWeeklyStats = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekActivities = activities.filter(a => new Date(a.createdAt) > weekAgo);
    
    const totalDuration = weekActivities.reduce((sum, a) => sum + a.duration, 0);
    const totalCalories = weekActivities.reduce((sum, a) => sum + a.calories, 0);
    const activityTypes = [...new Set(weekActivities.map(a => a.activityType))];
    
    return {
      totalDuration,
      totalCalories,
      activityCount: weekActivities.length,
      uniqueTypes: activityTypes.length
    };
  };

  const weeklyStats = calculateWeeklyStats();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
           ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Weekly Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalDuration} min</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{weeklyStats.totalCalories}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{weeklyStats.activityCount}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variety</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{weeklyStats.uniqueTypes}</div>
            <p className="text-xs text-muted-foreground">Activity types</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="log" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="log" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Log Activity</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Activity History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Activity Logging</CardTitle>
              <CardDescription>
                Choose an activity type and get DNA-powered recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {activityTypes.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <Card 
                      key={activity.id}
                      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-primary"
                      onClick={() => setIsLogging(true)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-6 w-6 ${activity.color}`} />
                          <div className="flex-1">
                            <h3 className="font-medium">{activity.name}</h3>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                          <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Your latest activities with DNA-powered feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Activities Logged</h3>
                  <p className="text-gray-500 mb-4">Start tracking your activities to get DNA-powered insights</p>
                  <Button onClick={() => document.querySelector('[value="log"]')?.click()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Log First Activity
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => {
                    const Icon = getActivityIcon(activity.activityType);
                    return (
                      <div key={activity.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className={`h-5 w-5 ${getActivityColor(activity.activityType)}`} />
                            <div>
                              <h4 className="font-medium capitalize">{activity.activityType}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{activity.duration} min</span>
                                <Badge variant="outline" className="text-xs">
                                  {activity.intensity}
                                </Badge>
                                <span>{activity.calories} cal</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">{formatTime(activity.createdAt)}</div>
                          </div>
                        </div>

                        {activity.description && (
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        )}

                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">DNA Feedback</span>
                          </div>
                          <p className="text-sm text-blue-800">{activity.feedback}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}