"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Zap,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChefHat,
  Calendar,
  Flame,
  Award,
  BookOpen,
  X
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
  tags: string[];
  rating: number;
  reviewCount: number;
  lastUsed?: string;
}

interface EnhancedMealHistoryProps {
  userId: string;
  refreshTrigger?: number;
}

export default function EnhancedMealHistory({ userId, refreshTrigger }: EnhancedMealHistoryProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("alignment");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minAlignment, setMinAlignment] = useState<number>(0);
  const [maxCalories, setMaxCalories] = useState<number>(1000);
  const [maxPrepTime, setMaxPrepTime] = useState<number>(60);
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced curated meals with more data
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
      isFavorite: false,
      tags: ["mediterranean", "vegetarian", "high-protein", "heart-healthy"],
      rating: 4.8,
      reviewCount: 124,
      lastUsed: "2024-01-15"
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
      isFavorite: false,
      tags: ["smoothie", "breakfast", "high-protein", "quick", "post-workout"],
      rating: 4.6,
      reviewCount: 89,
      lastUsed: "2024-01-14"
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
      isFavorite: false,
      tags: ["dinner", "fish", "omega-3", "heart-healthy", "gluten-free"],
      rating: 4.9,
      reviewCount: 156,
      lastUsed: "2024-01-13"
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
      isFavorite: false,
      tags: ["breakfast", "dessert", "vegetarian", "high-fiber", "make-ahead"],
      rating: 4.4,
      reviewCount: 67,
      lastUsed: "2024-01-12"
    },
    {
      id: "chicken-stir-fry",
      name: "Asian Chicken Stir-Fry",
      description: "Quick and flavorful stir-fry with lean protein and colorful vegetables",
      mealType: "dinner",
      calories: 380,
      protein: 28,
      carbs: 35,
      fat: 12,
      fiber: 8,
      prepTime: 20,
      difficulty: "Medium",
      dnaAlignment: 82,
      benefits: ["Lean protein", "Colorful vegetables", "Quick preparation", "Balanced macros"],
      ingredients: [
        "6 oz chicken breast, sliced",
        "2 cups mixed vegetables",
        "2 tbsp soy sauce",
        "1 tbsp ginger, minced",
        "2 cloves garlic",
        "1 tbsp sesame oil",
        "2 cups brown rice"
      ],
      instructions: [
        "Cook rice according to package directions",
        "Stir-fry chicken until golden",
        "Add vegetables and cook until crisp-tender",
        "Season with soy sauce, ginger, and garlic",
        "Serve over rice"
      ],
      dnaInsights: {
        metabolism: "Good for balanced metabolisms - provides steady energy",
        vitamins: "Rich in B-vitamins - supports energy metabolism",
        circadian: "Suitable for evening types - light enough for dinner",
        overall: "Good genetic match - balanced nutritional profile"
      },
      isFavorite: false,
      tags: ["dinner", "chicken", "asian", "quick", "high-protein"],
      rating: 4.3,
      reviewCount: 45,
      lastUsed: "2024-01-11"
    },
    {
      id: "avocado-toast",
      name: "Superfood Avocado Toast",
      description: "Nutrient-dense avocado toast with eggs and microgreens",
      mealType: "breakfast",
      calories: 320,
      protein: 15,
      carbs: 28,
      fat: 18,
      fiber: 10,
      prepTime: 10,
      difficulty: "Easy",
      dnaAlignment: 78,
      benefits: ["Healthy fats", "Complete protein", "Fiber-rich", "Quick preparation"],
      ingredients: [
        "2 slices whole grain bread",
        "1 ripe avocado",
        "2 eggs",
        "1 cup microgreens",
        "1 tbsp lemon juice",
        "Salt and pepper",
        "Red pepper flakes"
      ],
      instructions: [
        "Toast bread until golden",
        "Mash avocado with lemon juice",
        "Cook eggs to preference",
        "Spread avocado on toast",
        "Top with eggs and microgreens"
      ],
      dnaInsights: {
        metabolism: "Moderate for most types - balanced fat and protein",
        vitamins: "Good vitamin K and E source - supports bone and skin health",
        circadian: "Best for morning types - provides good energy start",
        overall: "Moderate genetic match - generally suitable"
      },
      isFavorite: false,
      tags: ["breakfast", "vegetarian", "quick", "healthy-fats", "superfood"],
      rating: 4.2,
      reviewCount: 78,
      lastUsed: "2024-01-10"
    }
  ];

  // Get all unique tags
  const allTags = Array.from(new Set(curatedMeals.flatMap(meal => meal.tags)));

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

  // Filter and sort curated meals
  const filteredMeals = curatedMeals
    .filter(meal => {
      // Search filter
      if (searchQuery && !meal.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !meal.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Meal type filter
      if (selectedMealType !== "all" && meal.mealType !== selectedMealType) {
        return false;
      }
      
      // Difficulty filter
      if (selectedDifficulty !== "all" && meal.difficulty !== selectedDifficulty) {
        return false;
      }
      
      // Tags filter
      if (selectedTags.length > 0 && !selectedTags.some(tag => meal.tags.includes(tag))) {
        return false;
      }
      
      // DNA alignment filter
      if (meal.dnaAlignment < minAlignment) {
        return false;
      }
      
      // Calories filter
      if (meal.calories > maxCalories) {
        return false;
      }
      
      // Prep time filter
      if (meal.prepTime > maxPrepTime) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let compareValue = 0;
      
      switch (selectedSort) {
        case "alignment":
          compareValue = a.dnaAlignment - b.dnaAlignment;
          break;
        case "calories":
          compareValue = a.calories - b.calories;
          break;
        case "prepTime":
          compareValue = a.prepTime - b.prepTime;
          break;
        case "rating":
          compareValue = a.rating - b.rating;
          break;
        case "name":
          compareValue = a.name.localeCompare(b.name);
          break;
        case "lastUsed":
          const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
          const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
          compareValue = dateA - dateB;
          break;
      }
      
      return sortOrder === "asc" ? compareValue : -compareValue;
    });

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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMealType("all");
    setSelectedDifficulty("all");
    setSelectedSort("alignment");
    setSortOrder("desc");
    setSelectedTags([]);
    setMinAlignment(0);
    setMaxCalories(1000);
    setMaxPrepTime(60);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Meal Management</CardTitle>
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
          <CardTitle>Enhanced Meal Management</CardTitle>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Utensils className="h-5 w-5" />
          <span>Enhanced Meal Management</span>
        </CardTitle>
        <CardDescription>
          Discover, filter, and track DNA-optimized meals with advanced search and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="curated" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="curated">DNA-Optimized Recipes</TabsTrigger>
            <TabsTrigger value="recent">Recent Meals</TabsTrigger>
          </TabsList>

          <TabsContent value="curated" className="space-y-4">
            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search meals by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {(selectedMealType !== "all" || selectedDifficulty !== "all" || selectedTags.length > 0 || minAlignment > 0 || maxCalories < 1000 || maxPrepTime < 60) && (
                    <Badge variant="secondary" className="ml-1">
                      {[
                        selectedMealType !== "all" ? 1 : 0,
                        selectedDifficulty !== "all" ? 1 : 0,
                        selectedTags.length > 0 ? 1 : 0,
                        minAlignment > 0 ? 1 : 0,
                        maxCalories < 1000 ? 1 : 0,
                        maxPrepTime < 60 ? 1 : 0
                      ].reduce((a, b) => a + b, 0)}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <Card className="p-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Meal Type</label>
                      <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Difficulty</label>
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Difficulties</SelectItem>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <div className="flex space-x-2">
                        <Select value={selectedSort} onValueChange={setSelectedSort}>
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alignment">DNA Alignment</SelectItem>
                            <SelectItem value="calories">Calories</SelectItem>
                            <SelectItem value="prepTime">Prep Time</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="lastUsed">Last Used</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        >
                          {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Min DNA Alignment: {minAlignment}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={minAlignment}
                        onChange={(e) => setMinAlignment(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Calories: {maxCalories}</label>
                      <input
                        type="range"
                        min="200"
                        max="1000"
                        value={maxCalories}
                        onChange={(e) => setMaxCalories(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Prep Time: {maxPrepTime} min</label>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        value={maxPrepTime}
                        onChange={(e) => setMaxPrepTime(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div className="mt-4">
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Button
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleTag(tag)}
                          className="text-xs"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{filteredMeals.length} meals found</span>
                <span>Sorted by {selectedSort} ({sortOrder === "asc" ? "ascending" : "descending"})</span>
              </div>
            </div>

            {/* Meal Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMeals.map((meal) => (
                <Card key={meal.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span>{meal.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(meal.id)}
                            className="ml-auto"
                          >
                            <Star className={`h-4 w-4 ${favorites.has(meal.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                          </Button>
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {meal.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {formatMealType(meal.mealType)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {meal.difficulty}
                      </Badge>
                      <Badge variant={getAlignmentBadge(meal.dnaAlignment)} className="text-xs">
                        {meal.dnaAlignment}% DNA Match
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Rating and Quick Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{meal.rating}</span>
                        <span className="text-gray-500">({meal.reviewCount})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{meal.prepTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>{meal.calories} cal</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {meal.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {meal.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{meal.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Nutrient Summary */}
                    <div className="grid grid-cols-4 gap-1 text-xs">
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-medium">{meal.protein}g</div>
                        <div className="text-gray-500">Protein</div>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-medium">{meal.carbs}g</div>
                        <div className="text-gray-500">Carbs</div>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-medium">{meal.fat}g</div>
                        <div className="text-gray-500">Fat</div>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-medium">{meal.fiber}g</div>
                        <div className="text-gray-500">Fiber</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => logCuratedMeal(meal)}
                        className="flex-1"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Log Meal
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Recipe
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{meal.name}</DialogTitle>
                            <DialogDescription>{meal.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Quick Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="text-center p-2 bg-gray-50 rounded">
                                <div className="font-medium">{meal.calories}</div>
                                <div className="text-gray-500">Calories</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded">
                                <div className="font-medium">{meal.prepTime}</div>
                                <div className="text-gray-500">Minutes</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded">
                                <div className="font-medium">{meal.difficulty}</div>
                                <div className="text-gray-500">Difficulty</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded">
                                <div className="font-medium">{meal.dnaAlignment}%</div>
                                <div className="text-gray-500">DNA Match</div>
                              </div>
                            </div>

                            {/* Benefits */}
                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                                Key Benefits:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {meal.benefits.map((benefit, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Ingredients */}
                            <div>
                              <h4 className="font-medium mb-2">Ingredients:</h4>
                              <ul className="text-sm space-y-1">
                                {meal.ingredients.map((ingredient, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{ingredient}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Instructions */}
                            <div>
                              <h4 className="font-medium mb-2">Instructions:</h4>
                              <ol className="text-sm space-y-2">
                                {meal.instructions.map((instruction, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">
                                      {index + 1}
                                    </span>
                                    <span>{instruction}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* DNA Insights */}
                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <Target className="h-4 w-4 mr-1 text-primary" />
                                DNA Insights:
                              </h4>
                              <div className="space-y-1 text-sm">
                                <div><strong>Metabolism:</strong> {meal.dnaInsights.metabolism}</div>
                                <div><strong>Vitamins:</strong> {meal.dnaInsights.vitamins}</div>
                                <div><strong>Circadian:</strong> {meal.dnaInsights.circadian}</div>
                                <div><strong>Overall:</strong> {meal.dnaInsights.overall}</div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMeals.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No meals found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                <Button onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {meals.length === 0 ? (
              <div className="text-center py-8">
                <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Meals Logged</h3>
                <p className="text-gray-500 mb-4">Start tracking your meals to get DNA-powered feedback</p>
                <Button onClick={() => document.querySelector('[value="curated"]')?.click()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Recipes
                </Button>
              </div>
            ) : (
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
                        <div className={`text-sm font-medium mt-1 ${getAlignmentColor(meal.dnaAlignment)}`}>
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

                    {/* Feedback */}
                    {meal.feedback && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-blue-900 text-sm">DNA Feedback</h5>
                            <p className="text-sm text-blue-700">{meal.feedback}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}