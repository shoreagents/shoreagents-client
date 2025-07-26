# ShoreAgents Client - Electron App

A modern desktop application built with Next.js and Electron, featuring a beautiful login page with an interactive world map and floating testimonials.

## 🚀 Features

- **Desktop Application**: Native desktop app using Electron
- **Modern UI**: Built with Next.js 14 and Tailwind CSS
- **Interactive World Map**: Aceternity UI World Map with animated connections
- **Floating Testimonials**: Dynamic testimonials positioned at map coordinates
- **Authentication System**: Login page with protected dashboard
- **Responsive Design**: Works on all screen sizes

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Electron dependencies
npm install --save-dev electron electron-builder concurrently wait-on --legacy-peer-deps
```

### Development Mode

```bash
# Start the development server with Electron
npm run electron-dev
```

This will:
1. Start the Next.js development server
2. Wait for the server to be ready
3. Launch the Electron app

### Build for Production

```bash
# Build the Next.js app
npm run build

# Package the Electron app
npm run dist
```

The built app will be available in the `dist` folder.

## 📁 Project Structure

```
shoreagents-client/
├── main.js                 # Electron main process
├── preload.js              # Electron preload script
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── src/
│   ├── app/               # Next.js app router
│   │   ├── login/         # Login page with world map
│   │   ├── page.tsx       # Dashboard (protected)
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── auth-guard.tsx # Authentication guard
│   └── contexts/         # React contexts
│       └── auth-context.tsx # Authentication context
└── public/
    └── images/
        └── testimonials/  # Testimonial images
```

## 🎨 Customization

### World Map Connections

Edit the `dots` array in `src/app/login/page.tsx` to modify map connections:

```javascript
dots={useMemo(() => [
  {
    start: { lat: -1, lng: 121.7740, label: "Philippines" },
    end: { lat: 37.7749, lng: -122.4194, label: "San Francisco" }
  },
  // Add more connections...
], [])}
```

### Testimonials

Update testimonials in `src/app/login/page.tsx`:

```javascript
// Custom positioning offsets
const testimonialOffsets = {
  sanFrancisco: { x: -120, y: 120 },
  canada: { x: -120, y: 0 },
  australia: { x: -290, y: -200 },
  newZealand: { x: -280, y: -20 }
}
```

### Styling

- **Background blur**: Modify `backdrop-blur-md` classes
- **Card width**: Change `max-w-[280px]` values
- **Colors**: Update Tailwind color classes

## 🚀 Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js app for production
- `npm run electron` - Run Electron app (requires built app)
- `npm run electron-dev` - Run in development mode
- `npm run dist` - Build and package for distribution
- `npm run lint` - Run ESLint

## 📦 Distribution

The app can be packaged for:

- **macOS**: `.dmg` file
- **Windows**: `.exe` installer
- **Linux**: `.AppImage` file

## 🔧 Configuration

### Electron Settings

Edit `main.js` to customize:
- Window size and properties
- Menu items
- Security settings

### Next.js Settings

Edit `next.config.js` for:
- Static export settings
- Image optimization
- Build output

## 🛡️ Security

- Context isolation enabled
- Node integration disabled
- Preload script for safe API exposure
- CSP headers for content security

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, please contact the development team.
