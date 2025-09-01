# JupitLunar GEO Content Engine - Next.js Project

This is the Next.js frontend for the JupitLunar GEO Content Engine, designed to maximize **Generative Engine Optimization (GEO)** for AI search engines and LLMs. The project has been successfully migrated from Create React App to Next.js 14, maintaining the original beautiful design while adding powerful SEO and content management capabilities.

## 🎯 Project Status

### ✅ **Completed Features**
- ✅ **Website Migration**: Successfully migrated from CRA to Next.js 14
- ✅ **Design Preservation**: Maintained original beautiful design and animations
- ✅ **Database Setup**: Complete Supabase schema with GEO optimization
- ✅ **API Endpoints**: Content ingestion and AI feed endpoints ready
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS

### 🔄 **Current Development**
- 🔄 **Dynamic Content Pages**: Implementing article and hub pages
- 🔄 **SEO Optimization**: Adding meta tags and structured data
- 🔄 **Content Management**: Building admin interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase project (already configured)
- (Optional) Firebase project for image storage

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual Supabase credentials
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3002](http://localhost:3002)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Homepage (migrated from CRA)
│   ├── globals.css        # Global styles with Tailwind
│   └── api/               # API routes
│       ├── ingest/        # Content ingestion endpoint
│       ├── ai-feed/       # AI content feed
│       └── llm/           # LLM answers endpoint
├── components/             # Reusable components
│   ├── Header.tsx         # Navigation header
│   ├── geo/               # GEO-optimized content components
│   └── ui/                # Base UI components
├── lib/                    # Utility libraries
│   ├── supabase.ts        # Supabase client and data layer
│   └── content-types.ts   # TypeScript types
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
    └── Assets/            # Migrated images from CRA
```

## 🎨 Design Features

### **Original Design Preserved**
- ✅ Hero Section with gradient backgrounds
- ✅ Product showcase with 3 main products (DearBaby, Baby SolidStart, DearBabyGPT)
- ✅ Horizontal scrolling features section
- ✅ All animations and interactions maintained
- ✅ Responsive design for mobile and desktop

### **Enhanced Functionality**
- ✅ Next.js Image optimization
- ✅ Improved performance with App Router
- ✅ Better SEO capabilities
- ✅ Content management ready

## 🗄️ Database Schema

The Supabase database is optimized for GEO with the following structure:

### **Core Tables**
- `articles` - Main content with full-text search
- `content_hubs` - 6 major content categories
- `citations` - Reference and source management
- `qas` - Q&A content for LLMs
- `user_management` - Newsletter and waitlist
- `ingestion_logs` - Content ingestion tracking

### **GEO Optimizations**
- Generated columns for full-text search
- Structured data ready for JSON-LD
- Content categorization for AI discovery
- Citation tracking for authority signals

## 🌐 API Endpoints

### **Content Management**
- `POST /api/ingest` - Protected endpoint for content ingestion
- `GET /api/ai-feed` - Machine-readable content feed (NDJSON)
- `GET /api/llm/answers` - Q&A data for LLMs (JSON)

### **Usage Examples**
```bash
# Get AI feed
curl http://localhost:3002/api/ai-feed

# Get LLM answers
curl http://localhost:3002/api/llm/answers

# Ingest content (requires authentication)
curl -X POST http://localhost:3002/api/ingest \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": {...}}'
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server (port 3002)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test:simple` - Test database connection

### Code Quality

- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict mode enabled with path aliases

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Pre-built components for GEO content
- **Responsive Design**: Mobile-first approach

## 📱 Content Types

The platform supports multiple content types, each optimized for GEO:

1. **Explainer** (`/learn/[hub]/[slug]`) - Educational content
2. **How-To** (`/how-to/[hub]/[slug]`) - Step-by-step guides
3. **Recipes** (`/recipes/[age]/[slug]`) - Food and nutrition
4. **FAQ** (`/faq/[hub]/[slug]`) - Question and answer content
5. **Research** (`/research/[yyyy]/[mm]/[slug]`) - Research briefs
6. **News** (`/news/[yyyy]/[mm]/[slug]`) - Latest updates

## 🚀 Deployment

This project is optimized for deployment on Vercel:

1. Connect your Git repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables Required
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TODO.md](./TODO.md) - Detailed development roadmap

## 🎯 Next Steps

See [TODO.md](./TODO.md) for detailed development roadmap. Current priorities:

1. **Dynamic Content Pages** - Article and hub pages
2. **SEO Optimization** - Meta tags and structured data
3. **Content Management** - Admin interface
4. **Search Functionality** - Full-text search

## 🤝 Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write TypeScript for all new code
3. Test your changes thoroughly
4. Update documentation as needed

## 📄 License

This project is proprietary to JupitLunar. All rights reserved.

---

*Last Updated: August 31, 2024*
*Migration Status: ✅ Complete*
*Next.js Version: 14.0.4*
