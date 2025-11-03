"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar as CalendarIcon,
  Clock,
  Utensils,
  Target,
  Plus,
  Star,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  Heart,
  Brain,
  ChefHat,
  ShoppingCart
} from "lucide-react";

interface MealPlan {
  id: string;
  date: string;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string[];
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  dnaAlignment: number;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
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
}

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  completed: boolean;
  mealIds: string[];
}

interface MealPlannerProps {
  userId: string;
}

export default function MealPlanner({ userId }: MealPlannerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>("current");
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [activeTab, setActiveTab] = useState("planner");

  // Mock curated meals (in real app, this would come from API)
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
      ingredients: ["1 cup quinoa", "1/2 cup chickpeas", "1/4 cup feta cheese", "1 cup mixed greens", "1/4 avocado", "2 tbsp olive oil", "1 tbsp lemon juice", "Fresh herbs"],
      instructions: ["Cook quinoa according to package directions", "Mix quinoa with chickpeas and greens", "Top with avocado and feta", "Drizzle with olive oil and lemon juice", "Garnish with fresh herbs"],
      dnaInsights: {
        metabolism: "Excellent for sensitive fat metabolism",
        vitamins: "High vitamin D absorption enhancers",
        circadian: "Perfect for morning types",
        overall: "Optimal genetic alignment"
      }
    },
    {
      id: "protein-smoothie",
      name: "Protein Power Smoothie",
      description: "High-protein smoothie optimized for muscle recovery",
      mealType: "breakfast",
      calories: 380,
      protein: 32,
      carbs: 28,
      fat: 15,
      fiber: 8,
      prepTime: 5,
      difficulty: "Easy",
      dnaAlignment: 88,
      benefits: ["High protein", "Quick preparation", "Muscle recovery"],
      ingredients: ["1 scoop whey protein", "1 banana", "1 tbsp almond butter", "1 cup spinach", "1/2 cup Greek yogurt", "1/2 cup almond milk", "1 tsp chia seeds"],
      instructions: ["Add all ingredients to blender", "Blend until smooth", "Add ice if desired", "Serve immediately"],
      dnaInsights: {
        metabolism: "Ideal for power muscle types",
        vitamins: "Enhanced vitamin absorption",
        circadian: "Great for morning circadian types",
        overall: "Excellent genetic match"
      }
    },
    {
      id: "salmon-plate",
      name: "Herb-Roasted Salmon Plate",
      description: "Omega-3 rich salmon with roasted vegetables",
      mealType: "dinner",
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 28,
      fiber: 10,
      prepTime: 25,
      difficulty: "Medium",
      dnaAlignment: 95,
      benefits: ["Omega-3 fatty acids", "High-quality protein", "Rich in vitamins"],
      ingredients: ["6 oz salmon fillet", "1 cup mixed vegetables", "2 tbsp olive oil", "Fresh herbs", "1 lemon", "2 cloves garlic"],
      instructions: ["Preheat oven to 400°F", "Season salmon with herbs and garlic", "Toss vegetables with olive oil", "Roast for 15-20 minutes", "Serve with lemon wedge"],
      dnaInsights: {
        metabolism: "Perfect for sensitive fat metabolism",
        vitamins: "Optimal vitamin D synergy",
        circadian: "Excellent for all circadian types",
        overall: "Superior genetic alignment"
      }
    }
  ];

  useEffect(() => {
    fetchMealPlans();
  }, [userId]);

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from API
      const mockPlans: MealPlan[] = [
        {
          id: "1",
          date: new Date().toISOString(),
          meals: {
            breakfast: "protein-smoothie",
            lunch: "mediterranean-bowl",
            dinner: "salmon-plate"
          },
          totalCalories: 1250,
          totalProtein: 85,
          totalCarbs: 98,
          totalFat: 65,
          totalFiber: 30,
          dnaAlignment: 91,
          goals: {
            calories: 2000,
            protein: 120,
            carbs: 200,
            fat: 70
          }
        }
      ];
      setMealPlans(mockPlans);
      generateShoppingList(mockPlans);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateShoppingList = (plans: MealPlan[]) => {
    const ingredientMap = new Map<string, { quantity: number; mealIds: string[]; category: string }>();
    
    plans.forEach(plan => {
      Object.values(plan.meals).forEach(mealId => {
        if (typeof mealId === 'string') {
          const meal = curatedMeals.find(m => m.id === mealId);
          if (meal) {
            meal.ingredients.forEach(ingredient => {
              const existing = ingredientMap.get(ingredient);
              if (existing) {
                existing.quantity += 1;
                existing.mealIds.push(meal.id);
              } else {
                ingredientMap.set(ingredient, {
                  quantity: 1,
                  mealIds: [meal.id],
                  category: categorizeIngredient(ingredient)
                });
              }
            });
          }
        }
      });
    });

    const list: ShoppingListItem[] = Array.from(ingredientMap.entries()).map(([name, data], index) => ({
      id: `item-${index}`,
      name,
      quantity: data.quantity > 1 ? `${data.quantity}x` : "1x",
      category: data.category,
      completed: false,
      mealIds: data.mealIds
    }));

    setShoppingList(list);
  };

  const categorizeIngredient = (ingredient: string): string => {
    const categories = {
      produce: ["spinach", "broccoli", "avocado", "lemon", "herbs", "greens", "banana"],
      protein: ["chicken", "salmon", "whey protein", "greek yogurt", "chickpeas"],
      grains: ["quinoa", "rice", "oats", "almonds", "chia seeds"],
      dairy: ["feta cheese", "yogurt", "milk", "cheese"],
      pantry: ["olive oil", "honey", "vanilla", "garlic", "spices"]
    };

    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => ingredient.toLowerCase().includes(item))) {
        return category;
      }
    }
    return "other";
  };

  const generateMealPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      // Mock API call - in real app, this would call an AI-powered meal planning service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPlan: MealPlan = {
        id: `plan-${Date.now()}`,
        date: selectedDate.toISOString(),
        meals: {
          breakfast: "protein-smoothie",
          lunch: "mediterranean-bowl",
          dinner: "salmon-plate",
          snacks: ["mixed berries", "almonds"]
        },
        totalCalories: 1450,
        totalProtein: 95,
        totalCarbs: 115,
        totalFat: 75,
        totalFiber: 35,
        dnaAlignment: 93,
        goals: {
          calories: 2000,
          protein: 120,
          carbs: 200,
          fat: 70
        }
      };

      setMealPlans(prev => [...prev, newPlan]);
      generateShoppingList([...mealPlans, newPlan]);
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const getAlignmentColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlignmentBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const toggleShoppingItem = (itemId: string) => {
    setShoppingList(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const getMealById = (mealId: string) => {
    return curatedMeals.find(meal => meal.id === mealId);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWeekDates = () => {
    const dates = [];
    const current = new Date(selectedDate);
    const startOfWeek = new Date(current);
    startOfWeek.setDate(current.getDate() - current.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meal Planner</CardTitle>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Meal Planning & Scheduling</span>
          </CardTitle>
          <CardDescription>
            Plan your meals for the week with DNA-optimized recipes and automated shopping lists
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={generateMealPlan}
              disabled={isGeneratingPlan}
              className="flex-1"
            >
              {isGeneratingPlan ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Weekly Meal Plan
                </>
              )}
            </Button>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">This Week</SelectItem>
                <SelectItem value="next">Next Week</SelectItem>
                <SelectItem value="custom">Custom Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planner">Weekly Planner</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Goals</TabsTrigger>
          <TabsTrigger value="shopping">Shopping List</TabsTrigger>
        </TabsList>

        {/* Weekly Planner Tab */}
        <TabsContent value="planner" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-7">
            {getWeekDates().map((date, index) => {
              const dayPlan = mealPlans.find(plan => 
                new Date(plan.date).toDateString() === date.toDateString()
              );
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <Card key={index} className={`${isToday ? 'border-primary' : ''}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dayPlan ? (
                      <>
                        {Object.entries(dayPlan.meals).map(([mealType, mealId]) => {
                          if (mealId && typeof mealId === 'string') {
                            const meal = getMealById(mealId);
                            return meal ? (
                              <div key={mealType} className="space-y-1">
                                <div className="text-xs font-medium capitalize text-gray-600">
                                  {mealType}
                                </div>
                                <div className="text-xs p-2 bg-gray-50 rounded text-gray-700">
                                  {meal.name}
                                </div>
                              </div>
                            ) : null;
                          }
                          return null;
                        })}
                        <div className="pt-2 border-t">
                          <div className="text-xs text-center">
                            <div className={`font-medium ${getAlignmentColor(dayPlan.dnaAlignment)}`}>
                              {dayPlan.dnaAlignment}% DNA Match
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <Utensils className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">No plan</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Nutrition Goals Tab */}
        <TabsContent value="nutrition" className="space-y-4">
          {mealPlans.length > 0 && (
            <>
              {/* Weekly Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Weekly Nutrition Overview</span>
                  </CardTitle>
                  <CardDescription>
                    Track your progress towards daily nutrition goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mealPlans.slice(0, 1).map((plan) => (
                      <div key={plan.id} className="space-y-4">
                        {/* Daily Goals Progress */}
                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Calories</span>
                              <span className="font-medium">{plan.totalCalories}/{plan.goals.calories}</span>
                            </div>
                            <Progress 
                              value={getProgressPercentage(plan.totalCalories, plan.goals.calories)} 
                              className="h-2"
                            />
                            <div className="text-xs text-gray-500">
                              {Math.round(getProgressPercentage(plan.totalCalories, plan.goals.calories))}% of daily goal
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Protein</span>
                              <span className="font-medium">{plan.totalProtein}g/{plan.goals.protein}g</span>
                            </div>
                            <Progress 
                              value={getProgressPercentage(plan.totalProtein, plan.goals.protein)} 
                              className="h-2"
                            />
                            <div className="text-xs text-gray-500">
                              {Math.round(getProgressPercentage(plan.totalProtein, plan.goals.protein))}% of daily goal
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Carbs</span>
                              <span className="font-medium">{plan.totalCarbs}g/{plan.goals.carbs}g</span>
                            </div>
                            <Progress 
                              value={getProgressPercentage(plan.totalCarbs, plan.goals.carbs)} 
                              className="h-2"
                            />
                            <div className="text-xs text-gray-500">
                              {Math.round(getProgressPercentage(plan.totalCarbs, plan.goals.carbs))}% of daily goal
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Fat</span>
                              <span className="font-medium">{plan.totalFat}g/{plan.goals.fat}g</span>
                            </div>
                            <Progress 
                              value={getProgressPercentage(plan.totalFat, plan.goals.fat)} 
                              className="h-2"
                            />
                            <div className="text-xs text-gray-500">
                              {Math.round(getProgressPercentage(plan.totalFat, plan.goals.fat))}% of daily goal
                            </div>
                          </div>
                        </div>

                        {/* DNA Alignment Score */}
                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Brain className="h-4 w-4 text-primary" />
                              <span className="font-medium">Overall DNA Alignment</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getAlignmentBadge(plan.dnaAlignment)}>
                                {plan.dnaAlignment >= 80 ? 'Excellent' : plan.dnaAlignment >= 60 ? 'Good' : 'Needs Improvement'}
                              </Badge>
                              <span className={`text-lg font-bold ${getAlignmentColor(plan.dnaAlignment)}`}>
                                {plan.dnaAlignment}%
                              </span>
                            </div>
                          </div>
                          <Progress value={plan.dnaAlignment} className="h-2 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Meal Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5" />
                    <span>Personalized Recommendations</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered suggestions based on your DNA profile and goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Optimal Protein Timing</h4>
                          <p className="text-sm text-blue-700">
                            Based on your muscle synthesis genes, distribute protein intake evenly across meals for best results.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">Carb Timing</h4>
                          <p className="text-sm text-green-700">
                            Your circadian rhythm suggests consuming most carbs earlier in the day for better energy management.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Heart className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-900">Healthy Fats</h4>
                          <p className="text-sm text-purple-700">
                            Your fat metabolism genes thrive on omega-3 fatty acids - include salmon, avocado, and nuts regularly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Shopping List Tab */}
        <TabsContent value="shopping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Smart Shopping List</span>
              </CardTitle>
              <CardDescription>
                Automatically generated from your meal plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shoppingList.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Shopping List</h3>
                  <p className="text-gray-500 mb-4">Generate a meal plan to create your shopping list</p>
                  <Button onClick={() => setActiveTab("planner")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Meal Plan
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Category Groups */}
                  {Object.entries(
                    shoppingList.reduce((acc, item) => {
                      if (!acc[item.category]) {
                        acc[item.category] = [];
                      }
                      acc[item.category].push(item);
                      return acc;
                    }, {} as Record<string, ShoppingListItem[]>)
                  ).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-medium text-gray-900 capitalize">{category}</h3>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <div 
                            key={item.id} 
                            className={`flex items-center space-x-3 p-2 border rounded-lg ${
                              item.completed ? 'bg-gray-50 opacity-60' : 'bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleShoppingItem(item.id)}
                              className="h-4 w-4 text-primary rounded"
                            />
                            <div className="flex-1">
                              <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {item.name}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">({item.quantity})</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.mealIds.length} meal{item.mealIds.length > 1 ? 's' : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Summary */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Items: {shoppingList.length}</span>
                      <span>Completed: {shoppingList.filter(item => item.completed).length}</span>
                    </div>
                    <Progress 
                      value={(shoppingList.filter(item => item.completed).length / shoppingList.length) * 100} 
                      className="h-2 mt-2"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}