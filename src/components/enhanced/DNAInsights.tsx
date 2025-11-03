"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Radar
} from "lucide-react";
import DNAVisualization from "./DNAVisualization";

interface DNATrait {
  name: string;
  value: string;
  category: string;
  riskLevel: number;
  description: string;
  recommendations: string[];
  impact: number; // 0-100 impact score
}

interface DNAInsightsProps {
  traits: DNATrait[];
  overallRiskLevel: number;
}

export default function DNAInsights({ traits, overallRiskLevel }: DNAInsightsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Traits", icon: Dna },
    { id: "metabolism", name: "Metabolism", icon: Brain },
    { id: "vitamin", name: "Vitamins", icon: Sun },
    { id: "circadian", name: "Circadian", icon: Moon },
    { id: "fitness", name: "Fitness", icon: Activity },
    { id: "cardiovascular", name: "Heart", icon: Heart },
  ];

  const filteredTraits = selectedCategory === "all" 
    ? traits 
    : traits.filter(trait => trait.category === selectedCategory);

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel <= 2) return "text-green-600";
    if (riskLevel <= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskBadge = (riskLevel: number) => {
    if (riskLevel <= 2) return "default";
    if (riskLevel <= 3) return "secondary";
    return "destructive";
  };

  const getRiskIcon = (riskLevel: number) => {
    if (riskLevel <= 2) return <CheckCircle className="h-4 w-4" />;
    if (riskLevel <= 3) return <Info className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getOverallRiskAssessment = (level: number) => {
    if (level <= 1.5) return { text: "Excellent", color: "text-green-600", description: "Your genetic profile shows optimal health markers" };
    if (level <= 2.5) return { text: "Good", color: "text-green-500", description: "Most genetic markers are within healthy ranges" };
    if (level <= 3.5) return { text: "Moderate", color: "text-yellow-600", description: "Some genetic factors require attention" };
    return { text: "High Risk", color: "text-red-600", description: "Multiple genetic factors need proactive management" };
  };

  const assessment = getOverallRiskAssessment(overallRiskLevel);

  return (
    <div className="space-y-6">
      {/* Overall Risk Assessment */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dna className="h-5 w-5" />
            <span>Overall Genetic Risk Assessment</span>
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your genetic health profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`text-3xl font-bold ${assessment.color}`}>
                {assessment.text}
              </div>
              <Badge variant={getRiskBadge(Math.ceil(overallRiskLevel))} className="text-sm">
                Risk Level: {overallRiskLevel.toFixed(1)}/5
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Overall Score</div>
              <div className="text-2xl font-bold">{Math.max(0, 100 - (overallRiskLevel * 20))}%</div>
            </div>
          </div>
          
          <Progress 
            value={Math.max(0, 100 - (overallRiskLevel * 20))} 
            className="h-3"
          />
          
          <p className="text-sm text-muted-foreground">
            {assessment.description}
          </p>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col items-center space-y-1 p-3"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTraits.map((trait, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-primary"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        {getRiskIcon(trait.riskLevel)}
                        <span>{trait.name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {trait.category}
                        </Badge>
                        <Badge variant={getRiskBadge(trait.riskLevel)} className="text-xs">
                          {trait.riskLevel <= 2 ? "Low Risk" : 
                           trait.riskLevel <= 3 ? "Moderate Risk" : "High Risk"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getRiskColor(trait.riskLevel)}`}>
                        {trait.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Level {trait.riskLevel}/5
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Description</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trait.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Recommendations</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {trait.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Genetic Impact</span>
                      <span className={`font-medium ${getRiskColor(trait.riskLevel)}`}>
                        {trait.riskLevel <= 2 ? "Minimal" : 
                         trait.riskLevel <= 3 ? "Moderate" : "Significant"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Advanced Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Radar className="h-5 w-5" />
            <span>Advanced Genetic Analysis</span>
          </CardTitle>
          <CardDescription>
            Interactive visualizations and detailed insights into your genetic profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DNAVisualization traits={traits} overallRiskLevel={overallRiskLevel} />
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Personalized Action Plan</span>
          </CardTitle>
          <CardDescription>
            Based on your genetic profile, here are your top priorities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {traits
              .filter(trait => trait.riskLevel >= 3)
              .slice(0, 3)
              .map((trait, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center space-x-2">
                    {getRiskIcon(trait.riskLevel)}
                    <span className="font-medium text-sm">{trait.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {trait.recommendations[0]}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}