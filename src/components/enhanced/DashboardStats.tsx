"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Award,
  Zap,
  Flame,
  Star,
  Crown
} from "lucide-react";

interface DashboardStatsProps {
  userStats: {
    level: number;
    points: number;
    streaks: {
      mealLogging: number;
      proteinGoal: number;
      activity: number;
      learning: number;
    };
    nutrientScore: number;
    weeklyProgress: number;
  };
}

export default function DashboardStats({ userStats }: DashboardStatsProps) {
  const getLevelIcon = (level: number) => {
    if (level >= 10) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (level >= 5) return <Star className="h-5 w-5 text-purple-500" />;
    return <Award className="h-5 w-5 text-blue-500" />;
  };

  const getStreakIcon = (count: number) => {
    if (count >= 30) return <Flame className="h-4 w-4 text-red-500" />;
    if (count >= 14) return <Flame className="h-4 w-4 text-orange-500" />;
    if (count >= 7) return <Flame className="h-4 w-4 text-yellow-500" />;
    return <Calendar className="h-4 w-4 text-gray-500" />;
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent!";
    if (score >= 80) return "Great job!";
    if (score >= 70) return "Good progress!";
    if (score >= 60) return "Keep going!";
    return "Room for improvement";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Nutrient Score Card */}
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nutrient Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold text-primary">{userStats.nutrientScore}%</div>
            <Badge variant="secondary" className="text-xs">
              {getScoreMessage(userStats.nutrientScore)}
            </Badge>
          </div>
          <Progress 
            value={userStats.nutrientScore} 
            className="h-2 transition-all duration-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>Goal: 100%</span>
          </div>
        </CardContent>
      </Card>

      {/* Longest Streak Card */}
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
          {getStreakIcon(Math.max(...Object.values(userStats.streaks)))}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold text-orange-500">
              {Math.max(...Object.values(userStats.streaks))} days
            </div>
            <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
              {Math.max(...Object.values(userStats.streaks)) >= 7 ? "On fire!" : "Building"}
            </Badge>
          </div>
          <div className="space-y-1">
            {Object.entries(userStats.streaks).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="capitalize text-muted-foreground">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-medium">{value} days</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Card */}
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold text-green-600">{userStats.weeklyProgress}%</div>
            <Badge variant="secondary" className="text-xs">
              {userStats.weeklyProgress >= 80 ? "Excellent" : 
               userStats.weeklyProgress >= 60 ? "Good" : "Keep going"}
            </Badge>
          </div>
          <Progress 
            value={userStats.weeklyProgress} 
            className="h-2 transition-all duration-500"
          />
          <div className="text-xs text-muted-foreground">
            {userStats.weeklyProgress >= 80 ? "You're crushing your goals this week!" :
             userStats.weeklyProgress >= 60 ? "Good progress, keep it up!" :
             "You're getting there, stay consistent!"}
          </div>
        </CardContent>
      </Card>

      {/* User Level Card */}
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Level</CardTitle>
          {getLevelIcon(userStats.level)}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold text-purple-600">{userStats.level}</div>
            <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
              {userStats.level >= 5 ? "Experienced" : "Growing"}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                Points
              </span>
              <span className="font-medium">{userStats.points.toLocaleString()}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {userStats.points >= 1000 ? "DNA Nutrition Expert" :
               userStats.points >= 500 ? "Health Enthusiast" :
               "Just getting started"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}