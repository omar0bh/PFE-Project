# TechWatch AI - Frontend Setup Guide

This is a professional React + Tailwind CSS frontend for the TechWatch AI application.

## Features

✨ **Modern UI/UX**
- Responsive design for all devices
- Dark theme for comfortable viewing
- Smooth animations and transitions
- Professional component library

🚀 **Performance**
- Built with Vite for fast development and production builds
- Optimized bundle size
- Lazy loading and code splitting
- Efficient API communication

📊 **Full-Featured**
- Dashboard with statistics and charts
- Source management with CRUD operations
- Article browsing with filtering
- Email settings configuration
- Real-time notifications

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend running on http://localhost:5000

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000` and automatically proxy API requests to `http://localhost:5000`.

### 3. Production Build

```bash
npm run build
npm run preview
```

## Environment Configuration

The frontend connects to the backend at `/api` endpoints. The Vite proxy automatically forwards requests from `http://localhost:3000/api/*` to `http://localhost:5000/api/*`.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Header.jsx
│   │   ├── Input.jsx
│   │   ├── Layout.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Sidebar.jsx
│   │   └── Toast.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Sources.jsx
│   │   ├── Articles.jsx
│   │   └── EmailSettings.jsx
│   ├── api.js              # API client
│   ├── utils.js            # Utility functions
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## API Endpoints

The frontend communicates with these Flask backend endpoints:

### Dashboard
- `GET /api/dashboard` - Get dashboard data (stats, recent articles, chart data)

### Sources Management
- `GET /api/sources` - Get all sources
- `POST /api/sources` - Add new source
- `POST /api/sources/<id>/delete` - Delete source
- `POST /api/scrape/<id>` - Scrape articles from source

### Articles
- `GET /api/articles` - Get all articles

### Email Settings
- `GET /api/email-settings` - Get current recipient email
- `POST /api/email-settings` - Save recipient email

## Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Chart.js** - Data visualization

## Customization

### Styling
- Colors and theme are defined in `tailwind.config.js`
- Global styles in `src/index.css`
- Component-specific styles using Tailwind classes

### Components
All components support customization through props:
- `Button` - Various variants (primary, success, danger, etc.) and sizes
- `Input` - With label, error states, and validation
- `Card` - Composable card components

## Performance Tips

1. **Code Splitting** - Automatic with Vite
2. **Image Optimization** - Use optimized images
3. **Bundle Analysis** - `npm run build` shows bundle size
4. **Caching** - Browser caching is configured in Vite

## Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3001
```

### API Connection Issues
- Ensure Flask backend is running on `http://localhost:5000`
- Check CORS headers in Flask
- Verify proxy configuration in `vite.config.js`

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Deploy to Different Servers

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When adding new features:
1. Create components in `src/components/`
2. Create pages in `src/pages/`
3. Update API client in `src/api.js`
4. Update styles in Tailwind config if needed

## License

Same as TechWatch AI backend.
