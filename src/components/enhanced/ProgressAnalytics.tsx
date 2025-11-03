"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  Calendar,
  Clock,
  Utensils,
  Activity,
  Zap,
  Star,
  ChevronUp,
  ChevronDown,
  BarChart3,
  PieChart,
  LineChart,
  Trophy,
  Fire,
  Heart,
  Brain,
  Scale,
  Apple,
  Dumbbell,
  Moon,
  Sun,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Lock
} from "lucide-react";

interface ProgressData {
  date: string;
  weight?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  dnaAlignment: number;
  mealsLogged: number;
  exerciseMinutes: number;
  sleepHours: number;
  waterIntake: number;
}

interface Goal {
  id: string;
  name: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
  type: 'daily' | 'weekly' | 'monthly';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Insight {
  id: string;
  type: 'trend' | 'achievement' | 'warning' | 'recommendation';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  trend?: 'up' | 'down' | 'stable';
}

interface ProgressAnalyticsProps {
  userId: string;
}

export default function ProgressAnalytics({ userId }: ProgressAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week");
  const [selectedCategory, setSelectedCategory] = useState<string>("overview");
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  // Mock progress data
  const mockProgressData: ProgressData[] = [
    {
      date: "2024-01-15",
      weight: 165,
      calories: 1850,
      protein: 85,
      carbs: 180,
      fat: 65,
      fiber: 22,
      dnaAlignment: 88,
      mealsLogged: 3,
      exerciseMinutes: 45,
      sleepHours: 7.5,
      waterIntake: 8
    },
    {
      date: "2024-01-14",
      weight: 165.5,
      calories: 1920,
      protein: 78,
      carbs: 195,
      fat: 72,
      fiber: 18,
      dnaAlignment: 85,
      mealsLogged: 4,
      exerciseMinutes: 30,
      sleepHours: 6.8,
      waterIntake: 7
    },
    {
      date: "2024-01-13",
      weight: 166,
      calories: 2100,
      protein: 92,
      carbs: 210,
      fat: 78,
      fiber: 25,
      dnaAlignment: 90,
      mealsLogged: 3,
      exerciseMinutes: 60,
      sleepHours: 8.2,
      waterIntake: 9
    },
    {
      date: "2024-01-12",
      weight: 166.2,
      calories: 1780,
      protein: 82,
      carbs: 175,
      fat: 62,
      fiber: 20,
      dnaAlignment: 87,
      mealsLogged: 3,
      exerciseMinutes: 0,
      sleepHours: 7.0,
      waterIntake: 6
    },
    {
      date: "2024-01-11",
      weight: 166.8,
      calories: 2050,
      protein: 88,
      carbs: 200,
      fat: 75,
      fiber: 23,
      dnaAlignment: 89,
      mealsLogged: 4,
      exerciseMinutes: 45,
      sleepHours: 7.8,
      waterIntake: 8
    },
    {
      date: "2024-01-10",
      weight: 167,
      calories: 1950,
      protein: 85,
      carbs: 190,
      fat: 70,
      fiber: 21,
      dnaAlignment: 86,
      mealsLogged: 3,
      exerciseMinutes: 30,
      sleepHours: 7.2,
      waterIntake: 7
    },
    {
      date: "2024-01-09",
      weight: 167.5,
      calories: 2200,
      protein: 95,
      carbs: 220,
      fat: 85,
      fiber: 26,
      dnaAlignment: 84,
      mealsLogged: 4,
      exerciseMinutes: 60,
      sleepHours: 8.0,
      waterIntake: 9
    }
  ];

  // Mock goals
  const mockGoals: Goal[] = [
    {
      id: "1",
      name: "Daily Protein Goal",
      category: "nutrition",
      target: 120,
      current: 85,
      unit: "g",
      deadline: "2024-01-31",
      completed: false,
      type: "daily"
    },
    {
      id: "2",
      name: "Weekly Exercise",
      category: "fitness",
      target: 300,
      current: 210,
      unit: "minutes",
      deadline: "2024-01-21",
      completed: false,
      type: "weekly"
    },
    {
      id: "3",
      name: "Weight Loss",
      category: "health",
      target: 160,
      current: 165,
      unit: "lbs",
      deadline: "2024-02-15",
      completed: false,
      type: "monthly"
    },
    {
      id: "4",
      name: "Daily Water Intake",
      category: "health",
      target: 8,
      current: 7.5,
      unit: "glasses",
      deadline: "2024-01-31",
      completed: false,
      type: "daily"
    },
    {
      id: "5",
      name: "Sleep Quality",
      category: "health",
      target: 8,
      current: 7.2,
      unit: "hours",
      deadline: "2024-01-31",
      completed: false,
      type: "daily"
    }
  ];

  // Mock achievements
  const mockAchievements: Achievement[] = [
    {
      id: "1",
      name: "First Steps",
      description: "Log your first meal",
      icon: "🍽️",
      unlocked: true,
      unlockedAt: "2024-01-09",
      category: "nutrition",
      rarity: "common"
    },
    {
      id: "2",
      name: "Week Warrior",
      description: "Log meals for 7 consecutive days",
      icon: "🗓️",
      unlocked: true,
      unlockedAt: "2024-01-15",
      category: "consistency",
      rarity: "rare"
    },
    {
      id: "3",
      name: "Protein Pro",
      description: "Meet protein goal for 5 days straight",
      icon: "💪",
      unlocked: false,
      category: "nutrition",
      rarity: "epic"
    },
    {
      id: "4",
      name: "DNA Master",
      description: "Achieve 90%+ DNA alignment for 10 meals",
      icon: "🧬",
      unlocked: false,
      category: "genetics",
      rarity: "legendary"
    },
    {
      id: "5",
      name: "Early Bird",
      description: "Log breakfast 5 days in a row",
      icon: "🌅",
      unlocked: true,
      unlockedAt: "2024-01-12",
      category: "consistency",
      rarity: "common"
    },
    {
      id: "6",
      name: "Hydration Hero",
      description: "Meet water goal for 7 days",
      icon: "💧",
      unlocked: false,
      category: "health",
      rarity: "rare"
    }
  ];

  // Mock insights
  const mockInsights: Insight[] = [
    {
      id: "1",
      type: "trend",
      title: "Weight Loss Progress",
      description: "You've lost 2.5 lbs in the past week. Great progress!",
      action: "Continue current nutrition plan",
      priority: "medium",
      category: "health",
      trend: "down"
    },
    {
      id: "2",
      type: "warning",
      title: "Protein Intake Low",
      description: "Your protein intake has been below target for 3 days",
      action: "Add more lean protein to meals",
      priority: "high",
      category: "nutrition",
      trend: "down"
    },
    {
      id: "3",
      type: "achievement",
      title: "Consistency Milestone",
      description: "You've maintained a 7-day meal logging streak!",
      action: "Keep up the great work",
      priority: "low",
      category: "consistency"
    },
    {
      id: "4",
      type: "recommendation",
      title: "Sleep Optimization",
      description: "Your sleep quality improves on days you exercise before 3 PM",
      action: "Schedule workouts earlier in the day",
      priority: "medium",
      category: "health"
    },
    {
      id: "5",
      type: "trend",
      title: "DNA Alignment Improving",
      description: "Your average DNA alignment has increased by 5%",
      action: "Continue following DNA recommendations",
      priority: "low",
      category: "genetics",
      trend: "up"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProgressData(mockProgressData);
      setGoals(mockGoals);
      setAchievements(mockAchievements);
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, [userId, selectedPeriod]);

  const calculateTrend = (data: ProgressData[], key: keyof ProgressData): 'up' | 'down' | 'stable' => {
    if (data.length < 2) return 'stable';
    
    const first = data[0][key] as number;
    const last = data[data.length - 1][key] as number;
    const change = ((last - first) / first) * 100;
    
    if (Math.abs(change) < 2) return 'stable';
    return change > 0 ? 'up' : 'down';
  };

  const calculateAverage = (data: ProgressData[], key: keyof ProgressData): number => {
    const values = data.map(d => d[key] as number).filter(v => v !== undefined);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      case 'stable': return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositive?: boolean) => {
    if (trend === 'stable') return 'text-gray-600';
    if (isPositive === false) {
      return trend === 'up' ? 'text-red-600' : 'text-green-600';
    }
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'text-blue-600';
      case 'achievement': return 'text-yellow-600';
      case 'warning': return 'text-red-600';
      case 'recommendation': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const currentData = progressData[0] || {};
  const previousData = progressData[1] || {};

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Progress Analytics & Insights</span>
          </CardTitle>
          <CardDescription>
            Track your journey with detailed analytics and personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="genetics">Genetics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center space-x-2">
              <Scale className="h-4 w-4" />
              <span>Weight</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {currentData.weight || '--'} lbs
            </div>
            <div className="flex items-center space-x-1 text-xs text-blue-700">
              {previousData.weight && (
                <>
                  {getTrendIcon(calculateTrend(progressData, 'weight'))}
                  <span className={getTrendColor(calculateTrend(progressData, 'weight'), false)}>
                    {Math.abs((currentData.weight! - previousData.weight!) / previousData.weight! * 100).toFixed(1)}%
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center space-x-2">
              <Apple className="h-4 w-4" />
              <span>DNA Alignment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {currentData.dnaAlignment || '--'}%
            </div>
            <div className="flex items-center space-x-1 text-xs text-green-700">
              {getTrendIcon(calculateTrend(progressData, 'dnaAlignment'))}
              <span className={getTrendColor(calculateTrend(progressData, 'dnaAlignment'), true)}>
                {calculateTrend(progressData, 'dnaAlignment') === 'up' ? 'Improving' : 'Stable'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center space-x-2">
              <Dumbbell className="h-4 w-4" />
              <span>Exercise</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {calculateAverage(progressData, 'exerciseMinutes').toFixed(0)} min
            </div>
            <div className="flex items-center space-x-1 text-xs text-purple-700">
              {getTrendIcon(calculateTrend(progressData, 'exerciseMinutes'))}
              <span className={getTrendColor(calculateTrend(progressData, 'exerciseMinutes'), true)}>
                Daily average
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 flex items-center space-x-2">
              <Moon className="h-4 w-4" />
              <span>Sleep</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {calculateAverage(progressData, 'sleepHours').toFixed(1)} hrs
            </div>
            <div className="flex items-center space-x-1 text-xs text-orange-700">
              {getTrendIcon(calculateTrend(progressData, 'sleepHours'))}
              <span className={getTrendColor(calculateTrend(progressData, 'sleepHours'), true)}>
                Daily average
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Nutrition Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5" />
                  <span>Nutrition Trends</span>
                </CardTitle>
                <CardDescription>
                  Key nutrition metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Calories</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {calculateAverage(progressData, 'calories').toFixed(0)} avg
                      </span>
                      {getTrendIcon(calculateTrend(progressData, 'calories'))}
                    </div>
                  </div>
                  <Progress 
                    value={(calculateAverage(progressData, 'calories') / 2000) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Protein</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {calculateAverage(progressData, 'protein').toFixed(0)}g avg
                      </span>
                      {getTrendIcon(calculateTrend(progressData, 'protein'))}
                    </div>
                  </div>
                  <Progress 
                    value={(calculateAverage(progressData, 'protein') / 120) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Fiber</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {calculateAverage(progressData, 'fiber').toFixed(0)}g avg
                      </span>
                      {getTrendIcon(calculateTrend(progressData, 'fiber'))}
                    </div>
                  </div>
                  <Progress 
                    value={(calculateAverage(progressData, 'fiber') / 25) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Health Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Health Metrics</span>
                </CardTitle>
                <CardDescription>
                  Overall health and wellness indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sleep Quality</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {calculateAverage(progressData, 'sleepHours').toFixed(1)} hrs
                      </span>
                      {getTrendIcon(calculateTrend(progressData, 'sleepHours'))}
                    </div>
                  </div>
                  <Progress 
                    value={(calculateAverage(progressData, 'sleepHours') / 8) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Exercise</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {calculateAverage(progressData, 'exerciseMinutes').toFixed(0)} min
                      </span>
                      {getTrendIcon(calculateTrend(progressData, 'exerciseMinutes'))}
                    </div>
                  </div>
                  <Progress 
                    value={(calculateAverage(progressData, 'exerciseMinutes') / 60) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Water Intake</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {calculateAverage(progressData, 'waterIntake').toFixed(0)} glasses
                      </span>
                      {getTrendIcon(calculateTrend(progressData, 'waterIntake'))}
                    </div>
                  </div>
                  <Progress 
                    value={(calculateAverage(progressData, 'waterIntake') / 8) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5" />
                <span>Recent Progress</span>
              </CardTitle>
              <CardDescription>
                Daily breakdown of your key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.slice(0, 5).map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium">{formatDate(data.date)}</div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {data.mealsLogged} meals
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {data.dnaAlignment}% DNA
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-right">
                        <div className="font-medium">{data.calories}</div>
                        <div className="text-gray-500">calories</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{data.exerciseMinutes}</div>
                        <div className="text-gray-500">exercise</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{data.sleepHours}</div>
                        <div className="text-gray-500">sleep</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Active Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Active Goals</span>
                </CardTitle>
                <CardDescription>
                  Track your progress towards your objectives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.filter(goal => !goal.completed).map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{goal.name}</h4>
                        <p className="text-sm text-gray-600">
                          {goal.current} / {goal.target} {goal.unit}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {goal.type}
                      </Badge>
                    </div>
                    <Progress 
                      value={(goal.current / goal.target) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Deadline: {formatDate(goal.deadline)}</span>
                      <span>{Math.round((goal.current / goal.target) * 100)}% complete</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Completed Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Completed Goals</span>
                </CardTitle>
                <CardDescription>
                  Celebrate your achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {goals.filter(goal => goal.completed).length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Complete your first goal to see it here!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {goals.filter(goal => goal.completed).map((goal) => (
                      <div key={goal.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-green-900">{goal.name}</h4>
                          <p className="text-sm text-green-700">
                            {goal.target} {goal.unit}
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`transition-all duration-300 ${
                  achievement.unlocked ? 'hover:shadow-lg' : 'opacity-60'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {achievement.category}
                    </Badge>
                    {achievement.unlocked ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Unlocked</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Lock className="h-4 w-4" />
                        <span className="text-xs">Locked</span>
                      </div>
                    )}
                  </div>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Unlocked on {formatDate(achievement.unlockedAt)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-transparent hover:border-l-primary transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'trend' ? 'bg-blue-100' :
                      insight.type === 'achievement' ? 'bg-yellow-100' :
                      insight.type === 'warning' ? 'bg-red-100' :
                      'bg-green-100'
                    }`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {insight.category}
                        </Badge>
                        {insight.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      {insight.action && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">Action:</span>
                          <span>{insight.action}</span>
                        </div>
                      )}
                    </div>
                    {insight.trend && (
                      <div className={`p-2 rounded-lg ${
                        insight.trend === 'up' ? 'bg-green-100' :
                        insight.trend === 'down' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        {getTrendIcon(insight.trend)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}