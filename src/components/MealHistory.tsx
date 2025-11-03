"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Utensils, 
  Target, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  Star,
  Plus,
  Heart,
  Zap
} from "lucide-react";

interface Meal {
  id: string;
  name: string;
  description?: string;
  mealType: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  dnaAlignment: number;
  feedback?: string;
  createdAt: string;
}

interface CuratedMeal {
  id: string;
  name: string;
  description: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  prepTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dnaAlignment: number;
  benefits: string[];
  ingredients: string[];
  instructions: string[];
  dnaInsights: {
    metabolism: string;
    vitamins: string;
    circadian: string;
    overall: string;
  };
  isFavorite: boolean;
}

interface MealHistoryProps {
  userId: string;
  refreshTrigger?: number;
}

export default function MealHistory({ userId, refreshTrigger }: MealHistoryProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Curated meals data
  const curatedMeals: CuratedMeal[] = [
    {
      id: "mediterranean-bowl",
      name: "Mediterranean Quinoa Bowl",
      description: "A nutrient-dense bowl packed with healthy fats, lean protein, and fiber",
      mealType: "lunch",
      calories: 420,
      protein: 18,
      carbs: 45,
      fat: 22,
      fiber: 12,
      prepTime: 15,
      difficulty: "Easy",
      dnaAlignment: 92,
      benefits: ["Heart-healthy fats", "High fiber", "Complete protein", "Rich in antioxidants"],
      ingredients: [
        "1 cup quinoa, cooked",
        "1/2 cup chickpeas",
        "1/4 cup feta cheese",
        "1 cup mixed greens",
        "1/4 avocado, sliced",
        "2 tbsp olive oil",
        "1 tbsp lemon juice",
        "Fresh herbs"
      ],
      instructions: [
        "Cook quinoa according to package directions",
        "Mix quinoa with chickpeas and greens",
        "Top with avocado and feta",
        "Drizzle with olive oil and lemon juice",
        "Garnish with fresh herbs"
      ],
      dnaInsights: {
        metabolism: "Excellent for sensitive fat metabolism - monounsaturated fats are easily processed",
        vitamins: "High vitamin D absorption enhancers - healthy fats help absorb fat-soluble vitamins",
        circadian: "Perfect for morning types - provides sustained energy without afternoon crash",
        overall: "Optimal genetic alignment - matches multiple DNA trait profiles"
      },
      isFavorite: false
    },
    {
      id: "protein-power-smoothie",
      name: "Protein Power Smoothie",
      description: "High-protein smoothie optimized for muscle recovery and metabolic health",
      mealType: "breakfast",
      calories: 380,
      protein: 32,
      carbs: 28,
      fat: 15,
      fiber: 8,
      prepTime: 5,
      difficulty: "Easy",
      dnaAlignment: 88,
      benefits: ["High protein", "Quick preparation", "Muscle recovery", "Metabolic boost"],
      ingredients: [
        "1 scoop whey protein",
        "1 banana",
        "1 tbsp almond butter",
        "1 cup spinach",
        "1/2 cup Greek yogurt",
        "1/2 cup almond milk",
        "1 tsp chia seeds"
      ],
      instructions: [
        "Add all ingredients to blender",
        "Blend until smooth",
        "Add ice if desired",
        "Serve immediately"
      ],
      dnaInsights: {
        metabolism: "Ideal for power muscle types - high protein supports muscle synthesis",
        vitamins: "Enhanced vitamin absorption - Greek yogurt improves nutrient uptake",
        circadian: "Great for morning circadian types - provides energy for morning workouts",
        overall: "Excellent genetic match - supports multiple trait profiles"
      },
      isFavorite: false
    },
    {
      id: "salmon-veggie-plate",
      name: "Herb-Roasted Salmon Plate",
      description: "Omega-3 rich salmon with roasted vegetables, perfect for cardiovascular health",
      mealType: "dinner",
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 28,
      fiber: 10,
      prepTime: 25,
      difficulty: "Medium",
      dnaAlignment: 95,
      benefits: ["Omega-3 fatty acids", "High-quality protein", "Rich in vitamins", "Anti-inflammatory"],
      ingredients: [
        "6 oz salmon fillet",
        "1 cup mixed vegetables",
        "2 tbsp olive oil",
        "Fresh herbs (rosemary, thyme)",
        "1 lemon",
        "2 cloves garlic",
        "Salt and pepper"
      ],
      instructions: [
        "Preheat oven to 400°F",
        "Season salmon with herbs, garlic, salt, and pepper",
        "Toss vegetables with olive oil",
        "Roast salmon and vegetables for 15-20 minutes",
        "Serve with lemon wedge"
      ],
      dnaInsights: {
        metabolism: "Perfect for sensitive fat metabolism - healthy omega-3s are easily utilized",
        vitamins: "Optimal vitamin D synergy - salmon enhances vitamin D absorption and utilization",
        circadian: "Excellent for all circadian types - supports overnight recovery and repair",
        overall: "Superior genetic alignment - addresses multiple high-priority traits"
      },
      isFavorite: false
    },
    {
      id: "chia-pudding",
      name: "Berry Chia Pudding",
      description: "Antioxidant-rich chia pudding perfect for vitamin absorption and digestive health",
      mealType: "breakfast",
      calories: 280,
      protein: 12,
      carbs: 32,
      fat: 14,
      fiber: 18,
      prepTime: 10,
      difficulty: "Easy",
      dnaAlignment: 85,
      benefits: ["High fiber", "Omega-3 fatty acids", "Antioxidants", "Probiotic support"],
      ingredients: [
        "3 tbsp chia seeds",
        "1 cup almond milk",
        "1/2 cup mixed berries",
        "1 tbsp honey",
        "1 tsp vanilla extract",
        "2 tbsp almonds",
        "Fresh mint"
      ],
      instructions: [
        "Mix chia seeds with almond milk and vanilla",
        "Refrigerate for at least 4 hours or overnight",
        "Top with berries, honey, and almonds",
        "Garnish with fresh mint",
        "Serve chilled"
      ],
      dnaInsights: {
        metabolism: "Great for fast metabolizers - provides sustained energy release",
        vitamins: "Enhances vitamin absorption - chia seeds improve nutrient bioavailability",
        circadian: "Perfect for all types - gentle on digestion any time of day",
        overall: "Strong genetic match - supports vitamin and metabolic traits"
      },
      isFavorite: false
    }
  ];

  useEffect(() => {
    fetchMeals();
  }, [userId, refreshTrigger]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/meals?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setMeals(data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch meals');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getAlignmentBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getAlignmentText = (score: number) => {
    if (score >= 80) return 'Aligned';
    if (score >= 60) return 'Moderate';
    return 'Needs Improvement';
  };

  const getAlignmentColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatMealType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const toggleFavorite = (mealId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(mealId)) {
        newFavorites.delete(mealId);
      } else {
        newFavorites.add(mealId);
      }
      return newFavorites;
    });
  };

  const logCuratedMeal = async (meal: CuratedMeal) => {
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name: meal.name,
          mealType: meal.mealType,
          description: meal.description,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          fiber: meal.fiber,
        }),
      });

      if (response.ok) {
        // Refresh meals list
        fetchMeals();
      }
    } catch (error) {
      console.error('Error logging meal:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (meals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Meals Logged</CardTitle>
          <CardDescription>
            Start tracking your meals to get DNA-powered feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Log your first meal to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Utensils className="h-5 w-5" />
          <span>Meal Management</span>
        </CardTitle>
        <CardDescription>
          Track your meals and discover DNA-optimized recipes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent Meals</TabsTrigger>
            <TabsTrigger value="curated">DNA-Optimized Recipes</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && meals.length === 0 && (
              <div className="text-center py-8">
                <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Meals Logged</h3>
                <p className="text-gray-500 mb-4">Start tracking your meals to get DNA-powered feedback</p>
                <Button onClick={() => document.querySelector('[value="curated"]')?.click()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Recipes
                </Button>
              </div>
            )}

            {!loading && !error && meals.length > 0 && (
              <div className="space-y-4">
                {meals.map((meal) => (
                  <div key={meal.id} className="border rounded-lg p-4 space-y-3">
                    {/* Meal Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{meal.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Badge variant="outline" className="text-xs">
                            {formatMealType(meal.mealType)}
                          </Badge>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(meal.createdAt)} {formatTime(meal.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getAlignmentBadge(meal.dnaAlignment)}>
                          {getAlignmentText(meal.dnaAlignment)}
                        </Badge>
                        <div className={`text-sm font-medium mt-1 ${getScoreColor(meal.dnaAlignment)}`}>
                          {meal.dnaAlignment}%
                        </div>
                      </div>
                    </div>

                    {/* Meal Description */}
                    {meal.description && (
                      <p className="text-sm text-gray-600">{meal.description}</p>
                    )}

                    {/* Nutrient Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{meal.calories || 0}</div>
                        <div className="text-gray-500">Calories</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{meal.protein || 0}g</div>
                        <div className="text-gray-500">Protein</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{meal.carbs || 0}g</div>
                        <div className="text-gray-500">Carbs</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{meal.fat || 0}g</div>
                        <div className="text-gray-500">Fat</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{meal.fiber || 0}g</div>
                        <div className="text-gray-500">Fiber</div>
                      </div>
                    </div>

                    {/* DNA Feedback */}
                    {meal.feedback && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">DNA Feedback</span>
                        </div>
                        
                        <Alert className={meal.dnaAlignment >= 80 ? 'border-green-200' : 
                                       meal.dnaAlignment >= 60 ? 'border-yellow-200' : 
                                       'border-red-200'}>
                          {meal.dnaAlignment >= 80 && <CheckCircle className="h-4 w-4" />}
                          {meal.dnaAlignment >= 60 && meal.dnaAlignment < 80 && <TrendingUp className="h-4 w-4" />}
                          {meal.dnaAlignment < 60 && <AlertTriangle className="h-4 w-4" />}
                          <AlertDescription>{meal.feedback}</AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="curated" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {curatedMeals.map((meal) => (
                <Card key={meal.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span>{meal.name}</span>
                          <Badge variant={getAlignmentBadge(meal.dnaAlignment)} className="text-xs">
                            {meal.dnaAlignment}% DNA Match
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {meal.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(meal.id)}
                        className="ml-2"
                      >
                        <Heart className={`h-4 w-4 ${favorites.has(meal.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {meal.prepTime} min
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {meal.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {formatMealType(meal.mealType)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Nutrient Summary */}
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{meal.calories}</div>
                        <div className="text-gray-500">Cal</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{meal.protein}g</div>
                        <div className="text-gray-500">Protein</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{meal.carbs}g</div>
                        <div className="text-gray-500">Carbs</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{meal.fat}g</div>
                        <div className="text-gray-500">Fat</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{meal.fiber}g</div>
                        <div className="text-gray-500">Fiber</div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <div className="text-sm font-medium mb-2 flex items-center">
                        <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                        Key Benefits:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {meal.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* DNA Insights */}
                    <div>
                      <div className="text-sm font-medium mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-1 text-primary" />
                        DNA Insights:
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">
                          <strong>Metabolism:</strong> {meal.dnaInsights.metabolism}
                        </div>
                        <div className="text-xs text-gray-600">
                          <strong>Vitamins:</strong> {meal.dnaInsights.vitamins}
                        </div>
                        <div className="text-xs text-gray-600">
                          <strong>Circadian:</strong> {meal.dnaInsights.circadian}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => logCuratedMeal(meal)}
                        className="flex-1"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Log Meal
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4 mr-1" />
                        View Recipe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}