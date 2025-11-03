# MetaBite - DNA Nutrition & Lifestyle App

A comprehensive DNA-powered nutrition and lifestyle tracking application that helps users personalize their eating and movement behavior based on their genetic profile.

## Features

### 🧬 DNA Engine Module
- Upload and process raw DNA files (23andMe, AncestryDNA, etc.)
- Extract genetic traits related to nutrition, metabolism, and lifestyle
- Generate personalized DNA profiles with actionable insights

### 🍽️ Food Tracking Module
- Log meals with detailed nutritional information
- Get real-time DNA-powered feedback on meal choices
- Track macronutrients and micronutrients
- View meal history with alignment scores

### 🧠 Balance System Module
- Daily nutrient balance visualization
- Weekly nutrient and caloric summaries
- Smart rebalancing tips based on DNA profile
- Visual feedback with progress tracking

### 🏃 Activity Engine Module
- Log physical activities with duration and intensity
- DNA-based activity classification (Power Burner, Endurance Burner, Balanced)
- Time-of-day feedback based on circadian rhythm
- Personalized activity recommendations

### 🔁 Behavior Engine Module
- Streak tracking for various health goals
- Habit formation with DNA-aligned challenges
- Adaptive challenge scaling
- Milestone celebrations and rewards

### 🎓 Education Layer Module
- Personalized learning content based on DNA profile
- Daily DNA facts and insights
- Contextual nudges and recommendations
- Progress tracking and achievements

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Backend**: Next.js API routes
- **State Management**: Zustand and TanStack Query
- **Authentication**: NextAuth.js (available)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd metabite
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Initialize database
```bash
npm run db:push
npm run db:generate
```

5. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Routes

### DNA Management
- `POST /api/dna/upload` - Upload DNA file
- `GET /api/dna/profile/[userId]` - Get DNA profile

### Meal Tracking
- `POST /api/meals` - Log a new meal
- `GET /api/meals` - Get user meals

### Activity Tracking
- `POST /api/activities` - Log activity
- `GET /api/activities` - Get user activities

### Streak Management
- `POST /api/streaks` - Update streak
- `GET /api/streaks` - Get user streaks

### Nutrient Balance
- `POST /api/nutrient-balance` - Update nutrient balance
- `GET /api/nutrient-balance` - Get nutrient balance

### Education Content
- `GET /api/education` - Get education content
- `POST /api/education` - Update learning progress

## Database Schema

The application uses the following main entities:

- **User**: Main user account
- **DNAProfile**: User's genetic profile and traits
- **DNATrait**: Individual genetic traits and categories
- **Meal**: Logged meals with nutritional data
- **Activity**: Physical activities and exercises
- **Streak**: Habit tracking and streak management
- **NutrientBalance**: Daily nutrient tracking and scoring
- **UserProgress**: User achievements and level progression
- **LearningProgress**: Educational content progress

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.