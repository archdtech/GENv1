"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dna, 
  Utensils, 
  Activity, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Plus,
  Target,
  Award,
  Calendar,
  Zap,
  Bell
} from "lucide-react";
import DNAUpload from "@/components/DNAUpload";
import MealLogging from "@/components/MealLogging";
import MealHistory from "@/components/MealHistory";
import MealPlanner from "@/components/enhanced/MealPlanner";
import EnhancedMealHistory from "@/components/enhanced/EnhancedMealHistory";
import ProgressAnalytics from "@/components/enhanced/ProgressAnalytics";
import DashboardStats from "@/components/enhanced/DashboardStats";
import DNAInsights from "@/components/enhanced/DNAInsights";
import Notifications from "@/components/enhanced/Notifications";
import ActivityTracker from "@/components/enhanced/ActivityTracker";
import NotificationBell from "@/components/enhanced/NotificationBell";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mealRefreshTrigger, setMealRefreshTrigger] = useState(0);

  // Enhanced user stats with more details
  const userStats = {
    level: 3,
    points: 1250,
    streaks: {
      mealLogging: 7,
      proteinGoal: 4,
      activity: 3,
      learning: 5
    },
    nutrientScore: 78,
    weeklyProgress: 65
  };

  // Enhanced DNA traits with detailed information
  const dnaTraits = [
    {
      name: "Fat Metabolism",
      value: "Sensitive",
      category: "metabolism",
      riskLevel: 3,
      description: "Your body processes saturated fats less efficiently, increasing cardiovascular risk.",
      recommendations: [
        "Choose lean proteins and healthy fats",
        "Limit saturated fat intake to less than 7% of daily calories",
        "Focus on monounsaturated fats like olive oil and avocados",
        "Consider omega-3 supplements for heart health"
      ]
    },
    {
      name: "Vitamin D Absorption",
      value: "Low",
      category: "vitamin",
      riskLevel: 4,
      description: "Reduced ability to absorb vitamin D from sunlight and food sources.",
      recommendations: [
        "Take vitamin D3 supplements (2000-4000 IU daily)",
        "Consume vitamin D with healthy fats for better absorption",
        "Get regular but moderate sun exposure",
        "Eat vitamin D-fortified foods"
      ]
    },
    {
      name: "Circadian Type",
      value: "Morning",
      category: "circadian",
      riskLevel: 1,
      description: "Your natural body clock is optimized for morning activities.",
      recommendations: [
        "Schedule important tasks and workouts before noon",
        "Eat your largest meal early in the day",
        "Avoid caffeine after 2 PM",
        "Maintain consistent sleep schedule"
      ]
    },
    {
      name: "Muscle Type",
      value: "Power",
      category: "fitness",
      riskLevel: 2,
      description: "Your muscles are genetically predisposed to strength and power activities.",
      recommendations: [
        "Focus on strength training and high-intensity exercises",
        "Include explosive movements in your workouts",
        "Prioritize protein intake for muscle recovery",
        "Allow adequate rest between strength sessions"
      ]
    }
  ];

  // Enhanced daily tips with actionable insights
  const dailyTips = [
    {
      title: "Protein First",
      content: "Based on your DNA, consider eating protein first in your meals to optimize metabolism and satiety.",
      icon: Target,
      priority: "high"
    },
    {
      title: "Morning Exercise",
      content: "Your morning circadian type suggests exercising before 10 AM for optimal performance and recovery.",
      icon: Calendar,
      priority: "medium"
    },
    {
      title: "Vitamin D Strategy",
      content: "Low vitamin D absorption - consider supplementation with healthy fats to enhance absorption.",
      icon: Target,
      priority: "high"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Dna className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MetaBite
                </h1>
                <p className="text-xs text-gray-500">DNA-Powered Nutrition</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1 bg-gradient-to-r from-purple-100 to-blue-100">
                <Award className="h-4 w-4" />
                <span>Level {userStats.level}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1 border-yellow-200">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>{userStats.points.toLocaleString()} pts</span>
              </Badge>
              <NotificationBell />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="dna" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Dna className="h-4 w-4" />
              <span className="hidden sm:inline">DNA</span>
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Utensils className="h-4 w-4" />
              <span className="hidden sm:inline">Food</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="balance" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Balance</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Welcome Section with Enhanced Tips */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span>Welcome to Your DNA Journey</span>
                </CardTitle>
                <CardDescription>
                  Here's what your genes want you to know today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {dailyTips.map((tip, index) => {
                    const Icon = tip.icon;
                    return (
                      <Card key={index} className={`border-l-4 ${
                        tip.priority === 'high' ? 'border-l-red-500 bg-red-50' : 
                        tip.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 
                        'border-l-blue-500 bg-blue-50'
                      }`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-2">
                            <Icon className={`h-4 w-4 mt-0.5 ${
                              tip.priority === 'high' ? 'text-red-500' : 
                              tip.priority === 'medium' ? 'text-yellow-500' : 
                              'text-blue-500'
                            }`} />
                            <div>
                              <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                              <p className="text-xs text-muted-foreground">{tip.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats Overview */}
            <DashboardStats userStats={userStats} />

            {/* Quick Actions and Insights */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Dna className="h-5 w-5" />
                      <span>Quick DNA Insights</span>
                    </CardTitle>
                    <CardDescription>
                      Your top genetic traits and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dnaTraits.slice(0, 3).map((trait, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{trait.name}</h4>
                            <Badge 
                              variant={
                                trait.riskLevel <= 2 ? "default" : 
                                trait.riskLevel <= 3 ? "secondary" : "destructive"
                              }
                              className="text-xs"
                            >
                              {trait.riskLevel <= 2 ? "Low" : 
                               trait.riskLevel <= 3 ? "Moderate" : "High"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{trait.value}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab("dna")}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                    <Button className="w-full" onClick={() => setActiveTab("dna")}>
                      <Dna className="h-4 w-4 mr-2" />
                      View Full DNA Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Notifications userId="user-123" />
              </div>
            </div>
          </TabsContent>

          {/* DNA Tab with Enhanced Insights */}
          <TabsContent value="dna" className="space-y-6">
            <DNAInsights 
              traits={dnaTraits} 
              overallRiskLevel={dnaTraits.reduce((sum, t) => sum + t.riskLevel, 0) / dnaTraits.length} 
            />
          </TabsContent>

          {/* Food Tab */}
          <TabsContent value="food" className="space-y-6">
            <Tabs defaultValue="logging" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="logging">Meal Logging</TabsTrigger>
                <TabsTrigger value="planning">Meal Planning</TabsTrigger>
                <TabsTrigger value="history">Enhanced History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="logging" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>Log New Meal</CardTitle>
                        <CardDescription>
                          Track what you eat and get DNA-powered feedback
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <MealLogging 
                          userId="user-123" 
                          onMealLogged={() => setMealRefreshTrigger(prev => prev + 1)} 
                        />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <MealHistory 
                      userId="user-123" 
                      refreshTrigger={mealRefreshTrigger} 
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="planning" className="space-y-6">
                <MealPlanner userId="user-123" />
              </TabsContent>
              
              <TabsContent value="history" className="space-y-6">
                <EnhancedMealHistory 
                  userId="user-123" 
                  refreshTrigger={mealRefreshTrigger} 
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Activity Tab with Enhanced Tracker */}
          <TabsContent value="activity" className="space-y-6">
            <ActivityTracker userId="user-123" />
          </TabsContent>

          {/* Balance Tab */}
          <TabsContent value="balance" className="space-y-6">
            <ProgressAnalytics userId="user-123" />
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Learning</CardTitle>
                <CardDescription>
                  Educational content tailored to your DNA profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Learning Content</h3>
                  <p className="text-gray-500 mb-4">
                    Personalized educational materials based on your genetic profile
                  </p>
                  <Button>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}