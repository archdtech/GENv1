"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Utensils, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  X,
  Target,
  Clock,
  ChefHat,
  Edit3,
  Save,
  Copy
} from "lucide-react";

interface MealItem {
  foodName: string;
  quantity: number;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface MealTemplate {
  id: string;
  name: string;
  description: string;
  mealType: string;
  items: MealItem[];
  prepTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  dnaAlignment: number;
  tags: string[];
}

interface Meal {
  id: string;
  name: string;
  description?: string;
  mealType: string;
  loggedAt: string;
  items: MealItem[];
  feedback?: {
    dnaAlignment: string;
    feedback: string;
    suggestions: string;
    score: number;
  };
}

interface MealLoggingProps {
  userId: string;
  onMealLogged?: (meal: Meal) => void;
}

const commonFoods = [
  { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
  { name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7 },
  { name: "Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, sugar: 1.5 },
  { name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0 },
  { name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, sugar: 4.2 },
  { name: "Greek Yogurt", calories: 100, protein: 10, carbs: 6, fat: 4, fiber: 0, sugar: 6 },
  { name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, sugar: 4 },
  { name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4 },
];

const mealTemplates: MealTemplate[] = [
  {
    id: "mediterranean-bowl",
    name: "Mediterranean Quinoa Bowl",
    description: "A balanced bowl with quinoa, grilled vegetables, and feta cheese",
    mealType: "lunch",
    prepTime: "15 min",
    difficulty: "easy",
    dnaAlignment: 92,
    tags: ["high-protein", "mediterranean", "vegetarian"],
    items: [
      { foodName: "Quinoa", quantity: 100, unit: "g", calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
      { foodName: "Cherry Tomatoes", quantity: 100, unit: "g", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
      { foodName: "Cucumber", quantity: 100, unit: "g", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
      { foodName: "Feta Cheese", quantity: 50, unit: "g", calories: 142, protein: 4, carbs: 1.1, fat: 11.4, fiber: 0 },
      { foodName: "Olive Oil", quantity: 1, unit: "tbsp", calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0 }
    ]
  },
  {
    id: "protein-breakfast",
    name: "High-Protein Breakfast",
    description: "Egg whites with spinach and whole grain toast",
    mealType: "breakfast",
    prepTime: "10 min",
    difficulty: "easy",
    dnaAlignment: 88,
    tags: ["high-protein", "low-carb", "quick"],
    items: [
      { foodName: "Egg Whites", quantity: 100, unit: "g", calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 },
      { foodName: "Spinach", quantity: 50, unit: "g", calories: 12, protein: 1.5, carbs: 1.8, fat: 0.2, fiber: 1.1 },
      { foodName: "Whole Grain Toast", quantity: 2, unit: "slices", calories: 140, protein: 6, carbs: 24, fat: 2, fiber: 4 },
      { foodName: "Avocado", quantity: 50, unit: "g", calories: 80, protein: 1, carbs: 4, fat: 7, fiber: 3.4 }
    ]
  },
  {
    id: "post-workout",
    name: "Post-Workout Recovery",
    description: "Protein shake with banana and almond butter",
    mealType: "snack",
    prepTime: "5 min",
    difficulty: "easy",
    dnaAlignment: 95,
    tags: ["post-workout", "protein", "quick"],
    items: [
      { foodName: "Whey Protein", quantity: 30, unit: "g", calories: 110, protein: 24, carbs: 1, fat: 1, fiber: 0 },
      { foodName: "Banana", quantity: 1, unit: "medium", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 },
      { foodName: "Almond Butter", quantity: 1, unit: "tbsp", calories: 98, protein: 3.4, carbs: 3, fat: 9, fiber: 1.6 },
      { foodName: "Almond Milk", quantity: 200, unit: "ml", calories: 30, protein: 1, carbs: 1, fat: 2.5, fiber: 0 }
    ]
  },
  {
    id: "grilled-salmon",
    name: "Grilled Salmon Dinner",
    description: "Salmon with roasted vegetables and sweet potato",
    mealType: "dinner",
    prepTime: "25 min",
    difficulty: "medium",
    dnaAlignment: 90,
    tags: ["omega-3", "gluten-free", "balanced"],
    items: [
      { foodName: "Salmon", quantity: 150, unit: "g", calories: 312, protein: 30, carbs: 0, fat: 19.5, fiber: 0 },
      { foodName: "Sweet Potato", quantity: 200, unit: "g", calories: 172, protein: 3.2, carbs: 40, fat: 0.2, fiber: 6 },
      { foodName: "Broccoli", quantity: 100, unit: "g", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1 },
      { foodName: "Olive Oil", quantity: 1, unit: "tbsp", calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0 }
    ]
  },
  {
    id: "energy-snack",
    name: "Energy Boost Snack",
    description: "Greek yogurt with berries and nuts",
    mealType: "snack",
    prepTime: "3 min",
    difficulty: "easy",
    dnaAlignment: 85,
    tags: ["antioxidants", "probiotics", "quick"],
    items: [
      { foodName: "Greek Yogurt", quantity: 150, unit: "g", calories: 150, protein: 15, carbs: 9, fat: 6, fiber: 0 },
      { foodName: "Mixed Berries", quantity: 100, unit: "g", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 7.6 },
      { foodName: "Almonds", quantity: 20, unit: "g", calories: 116, protein: 4.2, carbs: 4.4, fat: 10, fiber: 2.4 },
      { foodName: "Honey", quantity: 1, unit: "tsp", calories: 21, protein: 0, carbs: 5.4, fat: 0, fiber: 0 }
    ]
  }
];

const units = ["g", "oz", "cup", "tbsp", "tsp", "piece", "medium", "large"];

export default function MealLogging({ userId, onMealLogged }: MealLoggingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logging, setLogging] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [mealType, setMealType] = useState("");
  const [items, setItems] = useState<MealItem[]>([{ 
    foodName: "", 
    quantity: 100, 
    unit: "g" 
  }]);
  const [status, setStatus] = useState<'idle' | 'logging' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [editingTemplate, setEditingTemplate] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [customTemplateName, setCustomTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const addItem = () => {
    setItems([...items, { foodName: "", quantity: 100, unit: "g" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof MealItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const selectCommonFood = (index: number, food: typeof commonFoods[0]) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber,
      sugar: food.sugar,
      sodium: food.sodium,
    };
    setItems(updatedItems);
  };

  const selectTemplate = (templateId: string) => {
    const template = mealTemplates.find(t => t.id === templateId);
    if (template) {
      setMealName(template.name);
      setMealDescription(template.description);
      setMealType(template.mealType);
      setItems(template.items.map(item => ({ ...item })));
      setSelectedTemplate(templateId);
      setEditingTemplate(false);
      setShowTemplates(false);
    }
  };

  const applyTemplate = () => {
    if (selectedTemplate) {
      const template = mealTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        setMealName(template.name);
        setMealDescription(template.description);
        setMealType(template.mealType);
        setItems(template.items.map(item => ({ ...item })));
      }
    }
  };

  const resetToTemplate = () => {
    if (selectedTemplate) {
      applyTemplate();
    }
  };

  const getFilteredTemplates = () => {
    if (!mealType) return mealTemplates;
    return mealTemplates.filter(template => template.mealType === mealType);
  };

  const saveCustomTemplate = async () => {
    if (!customTemplateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    setSavingTemplate(true);
    
    // Simulate saving to localStorage or backend
    setTimeout(() => {
      const customTemplate: MealTemplate = {
        id: `custom-${Date.now()}`,
        name: customTemplateName,
        description: mealDescription || `Custom ${mealType} template`,
        mealType,
        prepTime: "Custom",
        difficulty: "easy",
        dnaAlignment: 85, // Default alignment for custom templates
        tags: ["custom"],
        items: items.map(item => ({ ...item }))
      };

      // Save to localStorage
      try {
        const savedTemplates = localStorage.getItem('custom-meal-templates');
        const templates = savedTemplates ? JSON.parse(savedTemplates) : [];
        templates.push(customTemplate);
        localStorage.setItem('custom-meal-templates', JSON.stringify(templates));
        
        setSavingTemplate(false);
        setShowSaveDialog(false);
        setCustomTemplateName("");
        setEditingTemplate(false);
        
        // Show success message
        setStatus('success');
        setMessage('Custom template saved successfully!');
      } catch (error) {
        setSavingTemplate(false);
        setStatus('error');
        setMessage('Failed to save template');
      }
    }, 1000);
  };

  const loadCustomTemplates = () => {
    try {
      const savedTemplates = localStorage.getItem('custom-meal-templates');
      return savedTemplates ? JSON.parse(savedTemplates) : [];
    } catch (error) {
      console.error('Error loading custom templates:', error);
      return [];
    }
  };

  const getAllTemplates = () => {
    const customTemplates = loadCustomTemplates();
    return [...mealTemplates, ...customTemplates];
  };

  const logMeal = async () => {
    if (!mealName || !mealType || items.some(item => !item.foodName)) {
      setStatus('error');
      setMessage('Please fill in all required fields');
      return;
    }

    setLogging(true);
    setStatus('logging');

    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name: mealName,
          description: mealDescription,
          mealType,
          items,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage('Meal logged successfully!');
        
        if (onMealLogged) {
          onMealLogged(result.meal);
        }

        // Reset form
        setMealName("");
        setMealDescription("");
        setMealType("");
        setItems([{ foodName: "", quantity: 100, unit: "g" }]);
        setSelectedTemplate("");
        setEditingTemplate(false);
        
        // Close dialog after success
        setTimeout(() => setIsOpen(false), 1500);
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to log meal');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error while logging meal');
    } finally {
      setLogging(false);
    }
  };

  const getAlignmentBadge = (alignment: string) => {
    switch (alignment) {
      case 'aligned': return 'default';
      case 'moderate': return 'secondary';
      case 'misaligned': return 'destructive';
      default: return 'outline';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDNABadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Log Meal
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log Your Meal</DialogTitle>
            <DialogDescription>
              Track what you eat and get DNA-powered feedback
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Template Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ChefHat className="h-4 w-4 text-purple-600" />
                  <Label className="text-sm font-medium">Quick Templates</Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-xs"
                >
                  {showTemplates ? "Hide" : "Show"} Templates
                </Button>
              </div>

              {showTemplates && (
                <div className="space-y-2">
                  <div className="grid gap-2 max-h-48 overflow-y-auto">
                    {getAllTemplates().map((template) => (
                      <Card 
                        key={template.id} 
                        className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                        } ${template.tags.includes('custom') ? 'border-blue-200' : ''}`}
                        onClick={() => selectTemplate(template.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm">{template.name}</h4>
                              {template.tags.includes('custom') && (
                                <Badge className="text-xs bg-blue-100 text-blue-800">
                                  Custom
                                </Badge>
                              )}
                              <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                                {template.difficulty}
                              </Badge>
                              <Badge className={`text-xs ${getDNABadgeColor(template.dnaAlignment)}`}>
                                {template.dnaAlignment}% DNA
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{template.prepTime}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {template.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectTemplate(template.id);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplate && (
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Template Applied</span>
                    <Badge className="text-xs bg-purple-100 text-purple-800">
                      {getAllTemplates().find(t => t.id === selectedTemplate)?.name}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingTemplate ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetToTemplate}
                          className="text-xs h-7"
                        >
                          Reset
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTemplate(false)}
                          className="text-xs h-7"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTemplate(true)}
                          className="text-xs h-7"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSaveDialog(true)}
                          className="text-xs h-7"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save as New
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            {status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Meal Details */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="mealName">Meal Name *</Label>
                <Input
                  id="mealName"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="e.g., Grilled Chicken Salad"
                  disabled={selectedTemplate && !editingTemplate}
                />
              </div>

              <div>
                <Label htmlFor="mealDescription">Description (Optional)</Label>
                <Textarea
                  id="mealDescription"
                  value={mealDescription}
                  onChange={(e) => setMealDescription(e.target.value)}
                  placeholder="Add any notes about your meal..."
                  disabled={selectedTemplate && !editingTemplate}
                />
              </div>

              <div>
                <Label htmlFor="mealType">Meal Type *</Label>
                <Select value={mealType} onValueChange={setMealType} disabled={selectedTemplate && !editingTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Food Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Food Items *</Label>
                <Button variant="outline" size="sm" onClick={addItem} disabled={selectedTemplate && !editingTemplate}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Item {index + 1}</Label>
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={selectedTemplate && !editingTemplate}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <div>
                        <Label className="text-xs">Food Name</Label>
                        <Input
                          value={item.foodName}
                          onChange={(e) => updateItem(index, 'foodName', e.target.value)}
                          placeholder="e.g., Chicken Breast"
                          disabled={selectedTemplate && !editingTemplate}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            disabled={selectedTemplate && !editingTemplate}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Unit</Label>
                          <Select 
                            value={item.unit} 
                            onValueChange={(value) => updateItem(index, 'unit', value)}
                            disabled={selectedTemplate && !editingTemplate}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map(unit => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Calories</Label>
                          <Input
                            type="number"
                            value={item.calories || ''}
                            onChange={(e) => updateItem(index, 'calories', parseFloat(e.target.value) || undefined)}
                            disabled={selectedTemplate && !editingTemplate}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <Label className="text-xs">Protein (g)</Label>
                          <Input
                            type="number"
                            value={item.protein || ''}
                            onChange={(e) => updateItem(index, 'protein', parseFloat(e.target.value) || undefined)}
                            disabled={selectedTemplate && !editingTemplate}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Carbs (g)</Label>
                          <Input
                            type="number"
                            value={item.carbs || ''}
                            onChange={(e) => updateItem(index, 'carbs', parseFloat(e.target.value) || undefined)}
                            disabled={selectedTemplate && !editingTemplate}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Fat (g)</Label>
                          <Input
                            type="number"
                            value={item.fat || ''}
                            onChange={(e) => updateItem(index, 'fat', parseFloat(e.target.value) || undefined)}
                            disabled={selectedTemplate && !editingTemplate}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Sugar (g)</Label>
                          <Input
                            type="number"
                            value={item.sugar || ''}
                            onChange={(e) => updateItem(index, 'sugar', parseFloat(e.target.value) || undefined)}
                            disabled={selectedTemplate && !editingTemplate}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Fiber (g)</Label>
                          <Input
                            type="number"
                            value={item.fiber || ''}
                            onChange={(e) => updateItem(index, 'fiber', parseFloat(e.target.value) || undefined)}
                            disabled={selectedTemplate && !editingTemplate}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Sodium (mg)</Label>
                          <Input
                            type="number"
                            value={item.sodium || ''}
                            onChange={(e) => updateItem(index, 'sodium', parseFloat(e.target.value) || undefined)}
                            disabled={selectedTemplate && !editingTemplate}
                          />
                        </div>
                      </div>

                      {/* Common Foods */}
                      <div>
                        <Label className="text-xs">Quick Select Common Foods</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {commonFoods.slice(0, 4).map(food => (
                            <Button
                              key={food.name}
                              variant="outline"
                              size="sm"
                              onClick={() => selectCommonFood(index, food)}
                              className="text-xs"
                              disabled={selectedTemplate && !editingTemplate}
                            >
                              {food.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Nutritional Summary */}
            {items.length > 0 && (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="h-4 w-4 text-purple-600" />
                    <Label className="text-sm font-medium">Nutritional Summary</Label>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                    <div>
                      <div className="text-xs text-gray-500">Calories</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {items.reduce((sum, item) => sum + (item.calories || 0), 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Protein</div>
                      <div className="text-lg font-semibold text-green-600">
                        {items.reduce((sum, item) => sum + (item.protein || 0), 0)}g
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Carbs</div>
                      <div className="text-lg font-semibold text-yellow-600">
                        {items.reduce((sum, item) => sum + (item.carbs || 0), 0)}g
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Fat</div>
                      <div className="text-lg font-semibold text-red-600">
                        {items.reduce((sum, item) => sum + (item.fat || 0), 0)}g
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Sugar</div>
                      <div className="text-lg font-semibold text-pink-600">
                        {items.reduce((sum, item) => sum + (item.sugar || 0), 0)}g
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Fiber</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {items.reduce((sum, item) => sum + (item.fiber || 0), 0)}g
                      </div>
                    </div>
                  </div>
                  
                  {/* DNA Alignment Indicator */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-600">DNA Alignment Analysis</span>
                      </div>
                      <Badge className="text-xs bg-green-100 text-green-800">
                        {selectedTemplate ? 
                          `${mealTemplates.find(t => t.id === selectedTemplate)?.dnaAlignment || 85}%` : 
                          '85%'
                        }
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button 
              onClick={logMeal} 
              disabled={logging || status === 'success'}
              className="w-full"
            >
              {logging ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging Meal...
                </>
              ) : (
                <>
                  <Utensils className="h-4 w-4 mr-2" />
                  Log Meal
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save Custom Template</DialogTitle>
            <DialogDescription>
              Save your current meal as a custom template for future use
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="templateName">Template Name *</Label>
              <Input
                id="templateName"
                value={customTemplateName}
                onChange={(e) => setCustomTemplateName(e.target.value)}
                placeholder="e.g., My High-Protein Bowl"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={saveCustomTemplate}
                disabled={savingTemplate || !customTemplateName.trim()}
              >
                {savingTemplate ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}