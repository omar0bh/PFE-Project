# TechWatch AI - Smart Technology Monitoring Platform

> A professional, AI-powered platform to automatically collect, analyze, and distribute technology news from your favorite sources.

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)
![Flask](https://img.shields.io/badge/Flask-3.0-black?logo=flask)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)

## 🌟 Features

### Dashboard
- 📊 Real-time statistics (sources, articles, AI analysis status)
- 📈 Interactive category distribution chart
- 🔍 Recent articles preview
- 💌 Digest email status and configuration

### Source Management
- ➕ Add unlimited technology websites to monitor
- 🏷️ Categorize sources for better organization
- 🔄 Manual article scraping with one-click
- 🗑️ Easy source management (edit/delete)

### Article Analysis
- 🤖 Automatic AI categorization using Google Gemini
- 📝 AI-generated summaries
- ⭐ Trend scoring algorithm
- 🔍 Advanced filtering (category, source, date)

### Email Digests
- 📧 Automated daily digest delivery
- 🔗 n8n workflow integration
- ✉️ Configurable recipient
- 📄 HTML and plain-text formats

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Google Gemini API key

### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database and API credentials

# Initialize database
python -c "from app import create_app; app = create_app()"

# Start Flask server
python run.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
# Install Node dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### Access Application
Open `http://localhost:3000` in your browser

## 📁 Project Structure

```
techwatch-ai/
├── app/                          # Flask backend
│   ├── __init__.py              # App factory
│   ├── config.py                # Configuration
│   ├── models.py                # Database models
│   ├── routes.py                # API routes
│   ├── extensions.py            # Extensions (DB, CORS)
│   ├── services/                # Business logic
│   │   ├── scraper.py          # Web scraping
│   │   ├── article_service.py  # Article processing
│   │   ├── ai_service.py       # AI analysis
│   │   ├── digest_service.py   # Email digest generation
│   │   └── mail_service.py     # Email delivery
│   ├── models/                  # Database models
│   ├── templates/               # Old HTML (deprecated)
│   └── static/                  # Old CSS (deprecated)
│
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sources.jsx
│   │   │   ├── Articles.jsx
│   │   │   └── EmailSettings.jsx
│   │   ├── api.js             # API client
│   │   ├── utils.js           # Utilities
│   │   ├── App.jsx            # Main app
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── n8n/                         # n8n workflows
│   └── daily_digest_workflow.json
│
├── requirements.txt             # Python dependencies
├── run.py                      # Entry point
├── init_db.sql                # Database schema
├── QUICKSTART.md              # Quick start guide
└── FRONTEND_MIGRATION.md      # Migration documentation
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=techwatch_ai

# Application
SECRET_KEY=your-secret-key-here
APP_BASE_URL=http://127.0.0.1:5000

# AI Analysis (Google Gemini)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com

# Optional
INTERNAL_API_KEY=your-internal-api-key
```

## 🔌 API Endpoints

### Dashboard
```
GET /api/dashboard
  - Returns: stats, recent articles, chart data
```

### Sources
```
GET    /api/sources           - Get all sources
POST   /api/sources           - Add new source
POST   /api/sources/<id>/delete - Delete source
POST   /api/scrape/<id>       - Scrape source
```

### Articles
```
GET /api/articles - Get all articles
```

### Email Settings
```
GET  /api/email-settings - Get current email
POST /api/email-settings - Save email
```

### Cron Jobs (Requires API Key)
```
POST /api/cron/run-daily - Run daily scraping and digest
  Header: X-API-KEY: your-internal-api-key
```

## 🎨 Design & Styling

The frontend uses **Tailwind CSS** with a professional dark theme:

- **Colors:** Custom color palette with primary blue (sky/cyan)
- **Typography:** Inter font family
- **Components:** Reusable component library
- **Responsive:** Mobile-first design

### Customizing Theme

Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      dark: { /* your colors */ }
    }
  }
}
```

## 🚀 Deployment

### Production Build

```bash
# Backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app

# Frontend
cd frontend
npm run build
# dist/ folder ready for deployment
```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]

# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Deployment Platforms

- **Vercel** (Frontend): `npm install -g vercel && vercel`
- **Railway** (Backend): Push to GitHub, connect to Railway
- **PythonAnywhere** (Backend): Upload files and configure
- **Netlify** (Frontend): Connect GitHub repo

## 📊 Database Schema

### Source Model
```python
- id: Primary key
- name: Source name
- url: Website URL
- category: Category tag
- active: Boolean (active/inactive)
- created_at: Timestamp
```

### Article Model
```python
- id: Primary key
- source_id: Foreign key to Source
- title: Article title
- url: Article URL
- content: Full text
- summary: AI-generated summary
- ai_category: AI categorization
- trend_score: Popularity score
- published_at: Article date
- created_at: Import timestamp
```

### EmailSetting Model
```python
- id: Primary key
- recipient_email: Email address
- created_at: Timestamp
- updated_at: Last update
```

## 🔐 Security

- ✅ CORS enabled for frontend-backend communication
- ✅ API key authentication for cron jobs
- ✅ Environment variables for secrets
- ✅ SQL injection protection via SQLAlchemy
- ✅ Email validation
- ✅ Rate limiting ready (use reverse proxy)

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
# Add tests in src/__tests__/
npm run test
```

### Backend Testing
```bash
# Add tests in tests/
pytest
```

## 📚 Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get up and running
- [Frontend README](./frontend/README.md) - Frontend-specific docs
- [Migration Guide](./FRONTEND_MIGRATION.md) - HTML to React migration details

## 🛠️ Troubleshooting

### Frontend won't connect to backend
1. Ensure Flask is running on `http://localhost:5000`
2. Check browser console for CORS errors
3. Verify proxy configuration in `frontend/vite.config.js`

### Database connection errors
1. Verify MySQL is running
2. Check `.env` credentials
3. Ensure database exists: `CREATE DATABASE techwatch_ai;`

### API returns 500 errors
1. Check Flask terminal for error messages
2. Verify all environment variables are set
3. Check database connectivity

### Styling issues in production
1. Rebuild frontend: `npm run build`
2. Clear browser cache
3. Check Tailwind purge configuration

## 🔄 Update & Maintenance

### Update Dependencies
```bash
# Backend
pip install --upgrade -r requirements.txt

# Frontend
cd frontend
npm update
npm audit fix
```

### Database Migrations
```bash
# Create new migration
python

# Backup database before migrations
mysqldump -u root -p techwatch_ai > backup.sql
```

## 📈 Performance Optimization

### Backend
- Database indexing on frequently queried fields
- Article deduplication
- Lazy loading of relationships
- Query optimization with SQLAlchemy

### Frontend
- Code splitting with Vite
- Image optimization
- CSS minification with Tailwind
- Asset caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

### Code Style
- Backend: PEP 8 with Black formatter
- Frontend: ESLint + Prettier

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI analysis
- n8n for workflow automation
- React community for incredible ecosystem
- Tailwind CSS for rapid UI development

## 📞 Support

- **Documentation**: See README files in subdirectories
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@techwatch-ai.example.com

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Article reading list / bookmarks
- [ ] Slack/Discord notifications
- [ ] Mobile app (React Native)
- [ ] Article search with Elasticsearch
- [ ] Custom AI model fine-tuning
- [ ] User authentication system
- [ ] Team collaboration features

---

**Built with ❤️ for tech enthusiasts and professionals**

*Last Updated: 2024 | Version 2.0 (React Frontend)*
