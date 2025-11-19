# Teaching Construct - Interactive 3D Learning Platform

A Matrix-inspired immersive 3D educational platform built with React, Three.js, and TypeScript. Create interactive lessons, guide students through 3D spaces, and deliver engaging educational experiences in a virtual "construct" environment.

![Version](https://img.shields.io/badge/version-2.0.0-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.158.0-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)

## 🎯 Features

### Core Functionality
- **3D Virtual Environment**: White void construct with interactive zones
- **WASD Movement**: First-person navigation through the learning space
- **Interactive Zones**: Color-coded content pods (lessons, videos, exercises)
- **Lesson System**: Multi-slide presentations with HTML content
- **Class Sessions**: Structured teaching flows with step-by-step guidance
- **Focus Mode**: Dim background to emphasize lesson content
- **Terminal Interface**: Command-line control for all features
- **Real-time HUD**: Class progress tracking and step indicators
- **3D Avatar**: Visual representation of the player
- **Audio System**: Ambient sounds and effects with toggle control

### Educational Features
- Pre-built lesson: "Intro to Human-AI Collaboration" (6 slides)
- Zone-based content organization
- Progress tracking for class sessions
- Proximity detection for zone interaction
- Guided teaching workflows

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Git**: Latest version
- **Modern Browser**: Chrome, Firefox, Edge, or Safari (latest versions)

## 🚀 Local Installation

### 1. Clone the Repository

```bash
git clone https://github.com/artquitech/cocolor.git
cd cocolor
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React & React DOM
- Three.js ecosystem (@react-three/fiber, @react-three/drei)
- Zustand (state management)
- Howler.js (audio)
- Tailwind CSS
- Lucide React (icons)
- TypeScript & build tools

### 3. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (default Vite port).

### 4. Build for Production

```bash
npm run build
```

Production files will be generated in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## 🌐 Online Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `dist`

4. **Production deployment**:
```bash
vercel --prod
```

**Environment**: No environment variables needed for basic deployment.

### Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Build the project**:
```bash
npm run build
```

3. **Deploy**:
```bash
netlify deploy --dir=dist --prod
```

**Or via Netlify UI**:
- Connect your GitHub repository
- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Add to `package.json`**:
```json
{
  "homepage": "https://yourusername.github.io/cocolor",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update `vite.config.ts`**:
```typescript
export default defineConfig({
  base: '/cocolor/',
  plugins: [react()],
})
```

4. **Deploy**:
```bash
npm run deploy
```

### Docker Deployment

1. **Create `Dockerfile`**:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Build and run**:
```bash
docker build -t teaching-construct .
docker run -p 8080:80 teaching-construct
```

Access at `http://localhost:8080`

## 🎮 Quick Start Guide

### 1. Boot Sequence
The system automatically boots when you open the application.

### 2. Terminal Commands

**Getting Started**:
```bash
help                          # Show all available commands
list lessons                  # View available lessons
start class "My Class"        # Begin a teaching session
enter construct              # Enter the 3D environment
```

**Navigation**:
- **WASD** or **Arrow Keys**: Move around
- **E**: Activate nearby zone
- **Mouse**: Look around (when not in terminal)

**Class Management**:
```bash
start class "AI Foundations"  # Start class with pre-configured zones
next step                     # Advance to next class step
previous step                 # Go back one step
end class                     # End current session
```

**Lesson Control**:
```bash
load lesson ai_intro_001      # Load specific lesson
next slide                    # Advance slide
previous slide                # Go back
exit lesson                   # Close lesson
focus on                      # Enable focus mode
focus off                     # Disable focus mode
```

**Zone Interaction**:
```bash
list zones                    # Show all zones
open zone zone_intro_ai       # Open specific zone
```

### 3. Typical Workflow

```bash
# Start teaching
> start class "Introduction to AI"
[CLASS] Started: Introduction to AI
[CLASS] 6 steps in this session

# Navigate through class
> next step
[STEP 2/6] Walk to the AI Introduction zone

# Enter 3D environment
> enter construct

# (Use WASD to walk to zones)
# (Press E when near a zone)

# Navigate lesson
> next slide
> focus on

# End session
> end class
```

## 🏗️ Project Structure

```
cocolor/
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── audio/           # Audio controller
│   │   ├── boot/            # Boot sequence
│   │   ├── construct/       # 3D environment & grid
│   │   ├── effects/         # Visual effects (glitch, matrix rain)
│   │   ├── lesson/          # Lesson panel component
│   │   ├── player/          # Player avatar & controller
│   │   ├── terminal/        # Terminal interface
│   │   ├── ui/              # UI components (HUD)
│   │   └── zones/           # Zone components
│   ├── data/
│   │   └── lessons.ts       # Lesson content database
│   ├── store/
│   │   └── useConstructStore.ts  # Zustand state management
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Customization

### Adding New Lessons

Edit `src/data/lessons.ts`:

```typescript
export const LESSONS: Record<string, Lesson> = {
  your_lesson_id: {
    id: "your_lesson_id",
    title: "Your Lesson Title",
    description: "Lesson description",
    slides: [
      {
        title: "Slide 1",
        content: `
          <div class="space-y-4">
            <h2 class="text-2xl font-bold text-green-400">Title</h2>
            <p class="text-lg">Your content here...</p>
          </div>
        `
      },
      // Add more slides...
    ]
  }
};
```

### Adding New Zones

In `ConstructEnvironment.tsx`, modify the `initialZones` or use `startClassSession`:

```typescript
const newZone = {
  id: 'zone_your_id',
  title: 'Your Zone Title',
  position: { x: 10, y: 0, z: -5 },
  type: 'lesson' as const,
  payloadId: 'your_lesson_id'
};
```

### Customizing Colors

Edit zone colors in `src/components/zones/Zone.tsx`:

```typescript
const getZoneColor = () => {
  switch (zone.type) {
    case 'lesson': return '#00ff00';  // Green
    case 'video': return '#00ffff';   // Cyan
    case 'image': return '#ffff00';   // Yellow
    case 'exercise': return '#ff00ff'; // Magenta
  }
};
```

## 🔧 Configuration

### Vite Configuration

Customize build settings in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Change dev server port
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})
```

### Tailwind Configuration

Modify `tailwind.config.js` for custom colors/spacing:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'matrix-green': '#00FF41',
      }
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Use different port
npm run dev -- --port 3000
```

**Build errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**:
```bash
# Check types
npx tsc --noEmit
```

**3D scene not loading**:
- Check browser console for WebGL errors
- Ensure browser supports WebGL 2.0
- Update graphics drivers

## 📊 Performance Optimization

### Production Build Optimization

1. **Enable compression** (Nginx example):
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

2. **Cache static assets**:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

3. **Lazy load lessons**:
```typescript
// Instead of importing all at once
const lesson = await import(`./lessons/${lessonId}.ts`);
```

## 🚀 Suggested Additional Features

### High Priority

#### 1. Multiplayer Support 👥
**Why**: Enable real-time collaborative learning experiences

**Implementation**:
- WebSocket server (Socket.io or Ably)
- Player position synchronization
- Shared lesson state
- Voice chat integration
- Avatar networking with name tags

**Complexity**: High | **Impact**: Very High

#### 2. Enhanced Content Types 📹
**Why**: Support diverse learning materials

**Features**:
- Video playback zones (YouTube, Vimeo API)
- Interactive quizzes with instant feedback
- Code editor zones (Monaco Editor integration)
- Image galleries with zoom
- PDF viewer integration
- 3D model viewer zones (GLTF/GLB)

**Complexity**: Medium | **Impact**: High

#### 3. Lesson Builder UI 🎨
**Why**: Empower non-technical educators to create content

**Features**:
- Drag-and-drop slide creator
- Visual zone placement editor
- WYSIWYG HTML editor
- Template library (lecture, workshop, demo)
- Real-time preview
- Export/import lesson packages (JSON)

**Complexity**: High | **Impact**: Very High

#### 4. Analytics Dashboard 📊
**Why**: Track student engagement and progress

**Metrics**:
- Time spent per zone/lesson
- Heatmaps of student movement
- Quiz scores and completion rates
- Attendance tracking
- Engagement metrics (interactions, zone visits)
- Export reports (CSV, PDF)

**Complexity**: Medium | **Impact**: High

### Medium Priority

#### 5. Authentication & User Management 🔐
**Why**: Multi-user support with permissions

**Features**:
- User registration/login (email + password)
- OAuth (Google, GitHub, Microsoft)
- Role-based access (admin, teacher, student)
- Class enrollment system
- Student profiles with avatars
- Permission levels per class

**Complexity**: Medium | **Impact**: High

#### 6. Recording & Playback 🎥
**Why**: Allow students to review missed classes

**Features**:
- Record class sessions (video + audio)
- Save player movements and interactions
- Timestamped navigation
- Speed controls (0.5x, 1x, 1.5x, 2x)
- Searchable transcripts
- Export to MP4

**Complexity**: Very High | **Impact**: Medium

#### 7. Advanced 3D Features 🌟
**Why**: Create more immersive environments

**Features**:
- Custom 3D models (GLTF/GLB import)
- Particle systems (confetti, sparkles)
- Environmental sounds per zone
- Weather effects (rain, snow, fog)
- Day/night cycle
- Teleportation portals
- Skybox customization

**Complexity**: High | **Impact**: Medium

#### 8. Collaborative Whiteboard 📝
**Why**: Real-time drawing and annotations

**Features**:
- Shared canvas in 3D space
- Drawing tools (pen, shapes, text)
- Real-time collaboration
- Save/load drawings
- Screenshot/export functionality
- Laser pointer tool for presentations

**Complexity**: High | **Impact**: High

### Low Priority

#### 9. Mobile Support 📱
**Why**: Access from smartphones/tablets

**Features**:
- Touch controls (virtual joystick)
- Responsive 3D rendering
- Mobile-optimized UI
- Gyroscope camera control
- Progressive Web App (PWA)

**Complexity**: High | **Impact**: Medium

#### 10. Accessibility Features ♿
**Why**: Make education inclusive

**Features**:
- Screen reader support (ARIA labels)
- High contrast mode
- Keyboard-only navigation
- Closed captions for audio/video
- Adjustable text sizes
- Color blind modes

**Complexity**: Medium | **Impact**: High

#### 11. AI Integration 🤖
**Why**: Intelligent teaching assistance

**Features**:
- AI teaching assistant (ChatGPT API)
- Auto-generated lesson summaries
- Question answering bot
- Content recommendations
- Automated quiz generation
- Student question analysis

**Complexity**: High | **Impact**: High

#### 12. Gamification 🎮
**Why**: Increase engagement and motivation

**Features**:
- Achievement system (badges)
- Points and XP
- Leaderboards (class/global)
- Collectibles hidden in zones
- Progress streaks
- Level system
- Custom avatars (unlockables)

**Complexity**: Medium | **Impact**: Medium

### Advanced Features

#### 13. VR/AR Support 🥽
**Why**: Next-level immersion

**Features**:
- WebXR integration
- VR headset support (Meta Quest, HTC Vive)
- Hand tracking
- AR mode for mobile (WebXR AR)
- Spatial audio
- Room-scale tracking

**Complexity**: Very High | **Impact**: Very High

#### 14. Content Management System 🗂️
**Why**: Centralized content administration

**Features**:
- Admin panel dashboard
- User management
- Content moderation
- Bulk import/export
- Version control for lessons
- Content scheduling
- Media library

**Complexity**: High | **Impact**: High

#### 15. Integration Capabilities 🔗
**Why**: Connect with existing tools

**Integrations**:
- LMS (Moodle, Canvas, Blackboard) via LTI
- Slack/Discord notifications
- Google Calendar sync
- Zoom/Teams embedding
- Google Classroom integration
- REST API for external tools
- Webhooks for events

**Complexity**: High | **Impact**: High

#### 16. Advanced Analytics 📈
**Why**: Data-driven teaching improvements

**Features**:
- ML-based student insights
- Predictive performance analytics
- Automatic intervention suggestions
- A/B testing for content
- Retention analysis
- Learning path recommendations
- Heatmap visualizations

**Complexity**: Very High | **Impact**: Medium

## 🔧 Technical Implementation Examples

### Adding Multiplayer (WebSocket)

```bash
# Install dependencies
npm install socket.io-client
```

```typescript
// src/lib/socket.ts
import io from 'socket.io-client';

export const socket = io('http://localhost:3001');

// Sync player position
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.emit('player-join', {
  id: userId,
  name: userName,
  position: player.position
});

// Listen for other players
socket.on('players-update', (players) => {
  setOtherPlayers(players);
});
```

### Adding Video Zones

```typescript
// In Zone.tsx
import { Html } from '@react-three/drei';

if (zone.type === 'video') {
  return (
    <group>
      <Html position={[zone.position.x, zone.position.y + 2, zone.position.z]}>
        <div className="bg-black p-4 rounded">
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${zone.payloadId}`}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </Html>
    </group>
  );
}
```

### Adding Quiz System

```typescript
// src/data/quizzes.ts
export interface Quiz {
  id: string;
  title: string;
  questions: {
    text: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }[];
}

export const QUIZZES: Record<string, Quiz> = {
  quiz_ai_001: {
    id: "quiz_ai_001",
    title: "AI Basics Quiz",
    questions: [
      {
        text: "What does AI stand for?",
        options: [
          "Automated Intelligence",
          "Artificial Intelligence",
          "Advanced Integration",
          "Assisted Information"
        ],
        correctAnswer: 1,
        explanation: "AI stands for Artificial Intelligence..."
      }
    ]
  }
};
```

### Adding Authentication

```bash
# Install dependencies
npm install @supabase/supabase-js
```

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update README for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by The Matrix movie franchise
- Built with React Three Fiber
- UI components from Lucide React
- Font: VT323 (Google Fonts)
- State management: Zustand
- Audio: Howler.js

## 📧 Support

For issues, questions, or suggestions:
- **GitHub Issues**: [Create an issue](https://github.com/artquitech/cocolor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/artquitech/cocolor/discussions)

## 🗺️ Roadmap

### v2.1.0 (Next Release) - Q1 2025
- [ ] Video zone implementation
- [ ] Quiz system with scoring
- [ ] Basic analytics dashboard
- [ ] Mobile touch controls

### v2.2.0 - Q2 2025
- [ ] Multiplayer support (WebSocket)
- [ ] Authentication system
- [ ] Lesson builder UI
- [ ] Recording & playback

### v3.0.0 - Q3 2025
- [ ] VR/AR support (WebXR)
- [ ] AI teaching assistant
- [ ] Advanced analytics (ML-based)
- [ ] Mobile native app

---

**Built with ❤️ for immersive education | Teaching Construct v2.0.0**
