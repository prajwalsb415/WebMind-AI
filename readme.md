# AI Website Builder Documentation

## Project Overview

AI Website Builder is a full-stack application that allows users to generate and customize complete websites using artificial intelligence. The application consists of:

1. **Backend API**: Node.js/Express server with Together AI integration
2. **Frontend UI**: React/TypeScript application with GrapesJS for visual website editing

## Architecture

```
├── Backend/                 # Express backend
│   ├── config/              # Configuration files
│   │   └── togetherClient.js  # Together AI client setup
│   ├── controllers/         # API request handlers
│   │   ├── textController.js  # Text improvement controllers
│   │   └── websiteController.js # Website generation logic
│   ├── routes/              # API route definitions
│   │   └── apiRoutes.js     # Route configuration
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies
│   └── server.js            # Server entry point
│
└── project/                 # React frontend
    ├── src/
    │   ├── components/      # React components
    │   │   ├── AIPopup.tsx  # AI website generation dialog
    │   │   ├── AiEditLeftPanel.jsx # AI editing sidebar
    │   │   ├── GenerationPage.tsx # GrapesJS editor page
    │   │   └── Sidebar.tsx  # Navigation sidebar
    │   ├── App.tsx          # Main application component
    │   ├── index.css        # Global and GrapesJS styles
    │   └── main.tsx         # Application entry point
    ├── package.json         # Frontend dependencies
    └── tailwind.config.js   # Tailwind CSS configuration
```

## Key Features

### 1. AI Website Generation

The application can generate complete websites from natural language descriptions:

- Users provide a text prompt describing the desired website
- Backend processes this through the Together AI API (using DeepSeek-R1-Distill-Llama-70B model)
- AI generates HTML, CSS, and JavaScript code for a complete website
- Generated website is loaded into a visual editor for further customization

### 2. Visual Website Editor

Built with [GrapesJS](https://grapesjs.com/), the visual editor provides:

- Drag-and-drop interface for arranging website components
- Style manager for customizing colors, typography, spacing, etc.
- Component hierarchy management through the Layers panel
- Live preview of website changes

### 3. AI-Assisted Editing

- **Text Improvement**: Enhance existing text content with AI suggestions
- **Component-Level Editing**: Select any component and request AI-specific changes
- **Context-Aware Generation**: Generate content based on the website's type/category

### 4. Theme Customization

- Select from predefined color themes during generation
- Customize website appearance through the style manager
- Apply consistent styling across the entire website

## Backend API

The backend provides several API endpoints for AI interaction:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/improve-text` | POST | Enhances provided text using AI |
| `/api/generate-website` | POST | Generates a complete website from a description |
| `/api/ai-changes` | POST | Makes AI-driven changes to selected content |

### AI Technologies

The application uses the [Together AI](https://together.ai/) platform with the DeepSeek-R1-Distill-Llama-70B model for:

- Natural language processing
- HTML code generation
- CSS styling suggestions
- JavaScript functionality creation

## Frontend Components

### Main Pages

- **Home Page**: List of created websites and "Create Website" button
- **Generation Page**: GrapesJS editor for customizing the generated website

### Key Components

- `AIPopup.tsx`: Dialog for entering website description and options
- `GenerationPage.tsx`: GrapesJS editor with custom plugins
- `AiEditLeftPanel.jsx`: Sidebar for AI-assisted editing

## Getting Started

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd project
npm install
npm run dev
```

### Environment Configuration

The backend requires a Together AI API key in the `Backend/.env` file:

```
PORT=3001
TOGETHER_API_KEY=your_api_key_here
```

## Workflow

1. User clicks "Create Website" and enters a website description
2. AI generates HTML, CSS, and JavaScript code
3. Generated website is loaded into the GrapesJS editor
4. User can visually customize the website or use AI-assisted editing
5. For specific component changes, user selects a component and provides instructions in the AI Edit panel

## Technologies Used

### Backend
- Node.js with Express
- Together AI API
- ES Modules

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- GrapesJS for website editing
- Vite for development and building
