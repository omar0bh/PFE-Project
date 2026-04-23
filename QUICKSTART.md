# Quick Start Guide

## Backend Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment (.env):**
```
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=techwatch_ai
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-key
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
INTERNAL_API_KEY=optional-api-key
```

3. **Initialize database:**
```bash
python -c "from app import create_app; app = create_app(); print('Database created')"
```

4. **Run Flask server:**
```bash
python run.py
```
Backend runs on `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

4. **Access the application:**
Open `http://localhost:3000` in your browser

## Project Structure

```
techwatch-ai/
├── app/                          # Flask backend
│   ├── routes.py                # API & routes
│   ├── models.py                # Database models
│   ├── config.py                # Configuration
│   ├── extensions.py            # Flask extensions
│   ├── services/               # Business logic
│   │   ├── scraper.py
│   │   ├── article_service.py
│   │   ├── digest_service.py
│   │   ├── ai_service.py
│   │   └── mail_service.py
│   ├── templates/              # OLD HTML templates (deprecated)
│   └── static/                 # OLD CSS (deprecated)
├── frontend/                     # React frontend (NEW)
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── api.js            # API client
│   │   ├── utils.js          # Utilities
│   │   └── App.jsx           # Main app
│   ├── package.json
│   └── vite.config.js
├── requirements.txt
├── run.py
└── n8n/                         # N8N workflows
```

## Key Features

### Dashboard
- Real-time statistics
- Article category chart
- Recent articles display
- Digest email configuration

### Sources Management
- Add/remove article sources
- Manual article scraping
- Category organization

### Article Analysis
- View all collected articles
- AI-generated categories
- Trend scoring
- Article filtering

### Email Settings
- Configure digest recipients
- Automatic n8n integration

## API Endpoints (React-Frontend)

```
GET    /api/dashboard              - Dashboard data
GET    /api/sources                - All sources
POST   /api/sources                - Add source
POST   /api/sources/<id>/delete    - Delete source
POST   /api/scrape/<id>            - Scrape articles
GET    /api/articles               - All articles
GET    /api/email-settings         - Email config
POST   /api/email-settings         - Save email
```

## Technology Stack

### Backend
- Flask 3.0.3
- SQLAlchemy ORM
- MySQL Database
- BeautifulSoup 4 (Web scraping)
- Google Gemini API (AI analysis)

### Frontend
- React 18
- Vite (Build tool)
- Tailwind CSS
- React Router
- Axios
- Chart.js

## Troubleshooting

### Frontend won't connect to backend
- Check Flask is running on port 5000
- Verify proxy config in `frontend/vite.config.js`
- Check browser console for CORS errors

### Database connection issues
- Verify MySQL is running
- Check .env credentials
- Run migrations if needed: `python init_db.sql`

### Port conflicts
- Backend: Change port in `run.py` from 5000 to another port
- Frontend: Change port in `frontend/vite.config.js` from 3000

## Next Steps

1. Add technology sources to monitor
2. Manually trigger scraping or set up n8n workflows
3. Configure email recipient for digests
4. Monitor articles and trends in dashboard

## Support

For issues with:
- **Backend**: Check Flask logs
- **Frontend**: Check browser console (F12)
- **Database**: Check MySQL logs

---

**Happy monitoring! 🚀**
