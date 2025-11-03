"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dna, 
  Brain, 
  Heart, 
  Activity, 
  Moon,
  Sun,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Target,
  Lightbulb,
  PieChart,
  BarChart3,
  Radar,
  Calendar,
  Zap
} from "lucide-react";

interface DNATrait {
  name: string;
  value: string;
  category: string;
  riskLevel: number;
  description: string;
  recommendations: string[];
  impact: number; // 0-100 impact score
}

interface DNAVisualizationProps {
  traits: DNATrait[];
  overallRiskLevel: number;
}

export default function DNAVisualization({ traits, overallRiskLevel }: DNAVisualizationProps) {
  const [selectedView, setSelectedView] = useState<"overview" | "categories" | "timeline" | "recommendations">("overview");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Traits", icon: Dna, color: "bg-blue-500" },
    { id: "metabolism", name: "Metabolism", icon: Brain, color: "bg-purple-500" },
    { id: "vitamin", name: "Vitamins", icon: Sun, color: "bg-yellow-500" },
    { id: "circadian", name: "Circadian", icon: Moon, color: "bg-indigo-500" },
    { id: "fitness", name: "Fitness", icon: Activity, color: "bg-green-500" },
    { id: "cardiovascular", name: "Cardiovascular", icon: Heart, color: "bg-red-500" },
  ];

  const filteredTraits = selectedCategory === "all" 
    ? traits 
    : traits.filter(trait => trait.category === selectedCategory);

  const getCategoryStats = () => {
    const stats = categories
      .filter(cat => cat.id !== "all")
      .map(category => {
        const categoryTraits = traits.filter(t => t.category === category.id);
        const avgRisk = categoryTraits.reduce((sum, t) => sum + t.riskLevel, 0) / categoryTraits.length || 0;
        const avgImpact = categoryTraits.reduce((sum, t) => sum + t.impact, 0) / categoryTraits.length || 0;
        const highRiskCount = categoryTraits.filter(t => t.riskLevel >= 4).length;
        
        return {
          category: category.id,
          name: category.name,
          color: category.color,
          traitCount: categoryTraits.length,
          avgRisk: Math.round(avgRisk * 10) / 10,
          avgImpact: Math.round(avgImpact),
          highRiskCount,
          icon: category.icon
        };
      });

    return stats.sort((a, b) => b.avgRisk - a.avgRisk);
  };

  const getRiskDistribution = () => {
    const distribution = {
      low: traits.filter(t => t.riskLevel <= 2).length,
      moderate: traits.filter(t => t.riskLevel === 3).length,
      high: traits.filter(t => t.riskLevel >= 4).length,
    };

    return distribution;
  };

  const getTopRecommendations = () => {
    return traits
      .filter(trait => trait.riskLevel >= 3)
      .sort((a, b) => b.riskLevel - a.riskLevel)
      .slice(0, 5)
      .map(trait => ({
        trait: trait.name,
        recommendation: trait.recommendations[0],
        priority: trait.riskLevel >= 4 ? "high" : "medium",
        impact: trait.impact
      }));
  };

  const categoryStats = getCategoryStats();
  const riskDistribution = getRiskDistribution();
  const topRecommendations = getTopRecommendations();

  const getImpactColor = (impact: number) => {
    if (impact >= 80) return "text-red-600";
    if (impact >= 60) return "text-orange-600";
    if (impact >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 4) return "text-red-600";
    if (risk >= 3) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Traits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{traits.length}</div>
            <div className="text-xs text-blue-700">Genetic markers analyzed</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{riskDistribution.low}</div>
            <div className="text-xs text-green-700">Optimal markers</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Moderate Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{riskDistribution.moderate}</div>
            <div className="text-xs text-yellow-700">Need attention</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{riskDistribution.high}</div>
            <div className="text-xs text-red-700">Priority action</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Category Analysis</span>
          </CardTitle>
          <CardDescription>
            Risk and impact analysis by genetic category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{stat.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {stat.traitCount} traits
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getRiskColor(stat.avgRisk)}`}>
                          Risk: {stat.avgRisk}/5
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stat.highRiskCount} high risk
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getImpactColor(stat.avgImpact)}`}>
                          Impact: {stat.avgImpact}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Overall effect
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Risk Level</span>
                        <span>{stat.avgRisk}/5</span>
                      </div>
                      <Progress 
                        value={(stat.avgRisk / 5) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Impact</span>
                        <span>{stat.avgImpact}%</span>
                      </div>
                      <Progress 
                        value={stat.avgImpact} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>Priority Recommendations</span>
          </CardTitle>
          <CardDescription>
            Action items based on your highest-risk genetic markers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRecommendations.map((rec, index) => (
              <div 
                key={index} 
                className={`p-4 border-l-4 rounded-r-lg ${
                  rec.priority === 'high' ? 'border-l-red-500 bg-red-50' : 'border-l-orange-500 bg-orange-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{rec.trait}</h4>
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.impact}% impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{rec.recommendation}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="ml-4"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Radar className="h-5 w-5" />
            <span>Genetic Impact Radar</span>
          </CardTitle>
          <CardDescription>
            Visual representation of your genetic profile across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Risk Distribution Chart */}
            <div className="space-y-4">
              <h3 className="font-medium">Risk Distribution</h3>
              <div className="space-y-3">
                {Object.entries(riskDistribution).map(([level, count]) => {
                  const percentage = (count / traits.length) * 100;
                  const colors = {
                    low: 'bg-green-500',
                    moderate: 'bg-yellow-500',
                    high: 'bg-red-500'
                  };
                  const labels = {
                    low: 'Low Risk',
                    moderate: 'Moderate Risk',
                    high: 'High Risk'
                  };
                  
                  return (
                    <div key={level} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{labels[level as keyof typeof labels]}</span>
                        <span>{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[level as keyof typeof colors]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Impact */}
            <div className="space-y-4">
              <h3 className="font-medium">Category Impact Scores</h3>
              <div className="space-y-3">
                {categoryStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.category} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{stat.name}</span>
                        </div>
                        <span className={`font-medium ${getImpactColor(stat.avgImpact)}`}>
                          {stat.avgImpact}%
                        </span>
                      </div>
                      <Progress value={stat.avgImpact} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Your Personalized Action Plan</span>
          </CardTitle>
          <CardDescription>
            Based on your genetic analysis, here's your 30-day action plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Week 1-2</span>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Focus on high-risk traits</li>
                <li>• Establish baseline measurements</li>
                <li>• Begin dietary adjustments</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className="font-medium">Week 3-4</span>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Implement exercise routine</li>
                <li>• Monitor progress</li>
                <li>• Adjust based on results</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Week 5-6</span>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Optimize routines</li>
                <li>• Schedule follow-up</li>
                <li>• Plan long-term strategy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}