# Outfit Generator with ETL Integration

A modern outfit generator built with Next.js, React, and Tailwind CSS, featuring ETL (Extract, Transform, Load) capabilities for data engineering workflows.

## Features

### Frontend Features
- Drag-and-drop image upload for shirts and pants
- Image compression and optimization
- Random outfit generation
- Manual outfit selection with hover effects
- Animated upload success alerts
- Add more clothes functionality

### ETL & Data Engineering Features
- **Extract**: Image metadata extraction, user behavior tracking, outfit preferences
- **Transform**: Image processing, data normalization, analytics aggregation
- **Load**: Database storage, analytics dashboard, recommendation engine

## ETL Integration Plan

### 1. Data Extraction Layer
- Extract image metadata (dimensions, file size, format)
- Track user interactions (clicks, uploads, outfit selections)
- Collect outfit generation patterns
- Extract weather data for outfit recommendations

### 2. Data Transformation Layer
- Normalize image data for consistent storage
- Aggregate user preferences and patterns
- Process weather data for outfit suggestions
- Generate analytics insights

### 3. Data Loading Layer
- Store processed data in PostgreSQL/MySQL
- Cache frequently accessed data in Redis
- Load analytics data for dashboard
- Feed recommendation engine

## Tech Stack

### Frontend
- Next.js 14 with App Router
- React 18 with hooks
- Tailwind CSS for styling
- Framer Motion for animations
- React Dropzone for file uploads
- Browser Image Compression

### Backend & ETL
- Node.js/Express API routes
- PostgreSQL for primary database
- Redis for caching
- Prisma ORM for database management
- JWT for authentication
- Multer for file handling

### Data Engineering Tools
- Apache Airflow for ETL orchestration
- Pandas for data manipulation
- NumPy for numerical operations
- Matplotlib/Plotly for data visualization

## Project Structure

```
outfit-generator-next/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   ├── lib/                    # Utility functions
│   ├── etl/                    # ETL pipelines
│   │   ├── extractors/         # Data extraction logic
│   │   ├── transformers/       # Data transformation logic
│   │   ├── loaders/           # Data loading logic
│   │   └── pipelines/         # Complete ETL workflows
│   ├── api/                    # API routes
│   └── types/                  # TypeScript type definitions
├── prisma/                     # Database schema and migrations
├── etl-scripts/               # Standalone ETL scripts
└── analytics/                 # Data visualization dashboards
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Run the development server:
```bash
npm run dev
```

4. Start ETL processes:
```bash
npm run etl:start
```

## ETL Workflows

### Daily Data Pipeline
1. Extract user interaction data
2. Transform and aggregate analytics
3. Load into analytics database
4. Update recommendation engine

### Image Processing Pipeline
1. Extract image metadata
2. Transform images (resize, compress, format)
3. Load processed images to CDN
4. Update image database records

### Weather Integration Pipeline
1. Extract weather data from APIs
2. Transform into outfit recommendations
3. Load recommendations into cache
4. Update outfit suggestion engine

## Future Enhancements

- Machine learning for outfit recommendations
- Real-time data streaming with WebSockets
- Advanced analytics dashboard
- A/B testing framework
- Multi-tenant architecture
- Cloud deployment with Docker/Kubernetes
