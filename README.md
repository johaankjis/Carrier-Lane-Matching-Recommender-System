# Carrier Lane Matching Recommender System

An AI-powered carrier matching system that intelligently recommends the best carriers for shipping lanes using machine learning and historical performance data.

## 📋 Overview

The Carrier Lane Matching Recommender System is a modern web application that helps logistics companies optimize their carrier selection process. By analyzing historical shipment data, carrier performance metrics, and lane characteristics, the system provides data-driven recommendations to match carriers with shipping lanes for optimal efficiency and cost-effectiveness.

## ✨ Features

- **Intelligent Carrier Matching**: ML-powered recommendation engine that matches carriers to lanes based on multiple factors
- **Real-time Dashboard**: Interactive dashboard displaying key metrics and performance indicators
- **Lane Selection**: Search and filter shipping lanes by origin and destination
- **Detailed Recommendations**: Comprehensive carrier recommendations with:
  - Match scores (0-100%)
  - Estimated costs and rates
  - Delivery time estimates
  - Carrier ratings and on-time performance
  - Score breakdown by factors
- **Historical Analysis**: Leverages carrier-lane historical performance data
- **Multi-factor Scoring**: Considers historical performance (40%), reliability (30%), cost competitiveness (20%), and experience (10%)

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend & Data Processing
- **Next.js API Routes** - RESTful API endpoints
- **Python** - Data processing and ML pipeline
- **Pandas** - Data manipulation and analysis
- **scikit-learn** - Machine learning algorithms
- **NumPy** - Numerical computing

### Additional Tools
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Vercel Analytics** - Performance monitoring

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │ Dashboard  │  │ Lane Selector │  │ Recommendations   │   │
│  │  Header    │  │   Component   │  │      List         │   │
│  └────────────┘  └──────────────┘  └───────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                     API Layer (Next.js)                      │
│  ┌───────┐  ┌──────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Lanes │  │ Carriers │  │ Metrics      │  │ Recommen-│  │
│  │  API  │  │   API    │  │    API       │  │ dations  │  │
│  └───────┘  └──────────┘  └──────────────┘  └──────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                 Data Processing Pipeline                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ ETL Load     │→ │ ETL Process  │→ │ ML Model        │  │
│  │ (Kaggle)     │  │ (Transform)  │  │ Training        │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Installation

### Prerequisites

- **Node.js** 18+ and **pnpm** installed
- **Python** 3.8+ with pip
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Carrier-Lane-Matching-Recommender-System.git
   cd Carrier-Lane-Matching-Recommender-System
   ```

2. **Install Node.js dependencies**
   ```bash
   pnpm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install pandas numpy scikit-learn kagglehub
   ```

4. **Run the ETL pipeline** (optional - sample data is included)
   ```bash
   # Load data from Kaggle
   python scripts/etl_load_data.py
   
   # Process and transform data
   python scripts/etl_process_data.py
   
   # Train ML model and generate recommendations
   python scripts/ml_train_model.py
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Running the Application

**Development mode:**
```bash
pnpm dev
```

**Production build:**
```bash
pnpm build
pnpm start
```

**Linting:**
```bash
pnpm lint
```

### Using the Dashboard

1. **View Metrics**: The top of the dashboard displays key metrics:
   - Total active lanes
   - Total registered carriers
   - Average match score
   - Average carrier rating

2. **Select a Lane**: Use the lane selector on the left to:
   - Search for lanes by city or state
   - Filter available shipping lanes
   - Click on a lane to view carrier recommendations

3. **Review Recommendations**: The main area shows:
   - Ranked carrier recommendations
   - Match scores and cost estimates
   - Carrier ratings and on-time percentages
   - Detailed score breakdowns

## 📊 Data Pipeline

### ETL Process

The system uses a three-step ETL (Extract, Transform, Load) pipeline:

#### 1. Data Loading (`etl_load_data.py`)
- Loads transportation data from Kaggle dataset
- Creates sample data if Kaggle dataset is unavailable
- Saves raw shipment data to `public/data/raw_shipments.json`

#### 2. Data Processing (`etl_process_data.py`)
- Cleans and validates raw data
- Creates lane-level features and aggregations
- Generates carrier performance profiles
- Builds carrier-lane historical performance records
- Outputs:
  - `public/data/lanes.json`
  - `public/data/carriers.json`
  - `public/data/carrier_lane_history.json`

#### 3. ML Model Training (`ml_train_model.py`)
- Creates feature vectors for similarity matching
- Calculates carrier recommendations using multi-factor scoring:
  - **Historical Performance (40%)**: Past performance on specific lane
  - **Reliability (30%)**: Overall on-time delivery and ratings
  - **Cost Competitiveness (20%)**: Rate comparison with lane average
  - **Experience (10%)**: Total shipments and volume
- Generates model metrics and performance statistics
- Outputs:
  - `public/data/recommendations.json`
  - `public/data/model_metrics.json`

## 🔌 API Reference

### Endpoints

#### `GET /api/lanes`
Returns all available shipping lanes.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "lane_id": "lane_001",
      "origin_city": "Los Angeles",
      "destination_city": "Chicago",
      "origin_state": "CA",
      "destination_state": "IL",
      "distance_miles": 2015,
      "shipment_count": 150
    }
  ]
}
```

#### `GET /api/lanes/[laneId]`
Returns details for a specific lane.

#### `GET /api/carriers`
Returns all available carriers with their performance metrics.

#### `GET /api/recommendations?lane_id={laneId}`
Returns carrier recommendations for a specific lane.

**Query Parameters:**
- `lane_id` (optional): Specific lane ID for recommendations
- `limit` (optional): Number of recommendations to return (default: 5)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "lane_id": "lane_001",
      "origin_city": "Los Angeles",
      "destination_city": "Chicago",
      "carrier_id": "carrier_001",
      "carrier_name": "Swift Transport",
      "match_score": 92.5,
      "estimated_rate": 2.75,
      "estimated_cost": 5541,
      "estimated_delivery_hours": 40,
      "carrier_rating": 4.8,
      "on_time_percentage": 96,
      "has_lane_history": true,
      "score_factors": {
        "historical_performance": 95,
        "reliability": 92,
        "cost_competitiveness": 88,
        "experience": 90
      }
    }
  ]
}
```

#### `GET /api/metrics`
Returns system-wide performance metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "total_lanes": 5,
      "total_carriers": 5,
      "avg_carrier_rating": 4.6
    },
    "avg_match_score": 87.3
  }
}
```

## 📁 Project Structure

```
Carrier-Lane-Matching-Recommender-System/
├── app/                          # Next.js app directory
│   ├── api/                     # API routes
│   │   ├── carriers/           # Carrier endpoints
│   │   ├── lanes/              # Lane endpoints
│   │   ├── metrics/            # Metrics endpoints
│   │   └── recommendations/    # Recommendation endpoints
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # React components
│   ├── dashboard-header.tsx    # Header component
│   ├── lane-selector.tsx       # Lane selection UI
│   ├── metrics-overview.tsx    # Metrics dashboard
│   ├── recommendations-list.tsx # Recommendations display
│   └── ui/                     # Reusable UI components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── public/                      # Static assets
│   └── data/                   # Generated data files
├── scripts/                     # Python ETL and ML scripts
│   ├── etl_load_data.py        # Data loading
│   ├── etl_process_data.py     # Data transformation
│   ├── ml_train_model.py       # ML model training
│   └── run_etl.py              # ETL orchestration
├── styles/                      # Additional stylesheets
├── components.json              # Component configuration
├── next.config.mjs              # Next.js configuration
├── package.json                 # Node.js dependencies
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🧪 Development

### Component Development

Components are built using:
- **React 19** with TypeScript
- **Radix UI** for accessible primitives
- **Tailwind CSS** for styling
- **shadcn/ui** patterns

### Adding New Features

1. Create component in `components/` directory
2. Add API route in `app/api/` if needed
3. Update types and interfaces
4. Test in development mode

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Tailwind CSS utility classes
- Maintain component modularity

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Transportation dataset from Kaggle
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is a demonstration project showcasing AI-powered recommendation systems for logistics optimization. The data used is for demonstration purposes only.
