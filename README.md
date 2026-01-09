# FutureHire - Complete Placement & Career Guidance Platform

A comprehensive web platform for career guidance, placement preparation, and skill development.

## Features

### 🔐 Authentication
- User registration and login with JWT
- Mobile OTP verification
- Secure password hashing

### 🏢 Companies Module
- Company profiles with history, branches, hiring patterns
- Fresher job roles with salaries
- Internship application links
- Skills required for each company

### 🎯 Skills Development
- **Technical Skills**: DSA, Web Dev, ML, etc.
- **Communication Skills**: Speaking, writing, grammar AI
- **Soft Skills**: Leadership, teamwork, time management
- Free & paid learning resources
- Practice tests and mock interviews

### 📚 Courses & Roadmaps
- 30+ job role specific courses
- YouTube playlists and notes
- Career roadmaps
- Placement basics (Aptitude, Reasoning, HR)

### 🎓 Higher Studies
- M.Tech, MBA, MS, GATE, GRE, UPSC, etc.
- Course details, eligibility, duration
- Career paths and salary expectations

### 🔍 Job Predictor
- Resume upload and AI analysis
- Skills extraction and improvement suggestions
- Company match predictions
- Role recommendations

### 👨‍🏫 Mentors
- Free and paid mentorship
- Domain experts availability
- Booking system

### 🤖 AI Chatbot
- Placement and career specific answers
- Company information queries
- Skill guidance

## Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** (Mongoose ODM)
- **JWT** Authentication
- **OpenAI** API (Chatbot & Resume Analysis)
- **Twilio** (OTP Service)
- **Multer** (File Uploads)

### Frontend
- **HTML5**, **CSS3**, **Tailwind CSS**
- **JavaScript** (ES6+)
- **Phosphor Icons**

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone/Download the project**
   ```bash
   git clone <repository-url>
   cd futurehire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/futurehire
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

4. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod
   ```

5. **Seed initial data**
   ```bash
   npm start
   # Then make a POST request to http://localhost:5000/api/seed
   ```

6. **Start the server**
   ```bash
   npm run dev  # For development
   npm start    # For production
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company details

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:category` - Get skills by category

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details

### Higher Studies
- `GET /api/higher-studies` - Get all higher study options
- `GET /api/higher-studies/:id` - Get study details

### Tests (Protected)
- `GET /api/tests` - Get available tests
- `GET /api/tests/:id` - Get test details
- `POST /api/tests/:id/submit` - Submit test answers

### Resume Analysis (Protected)
- `POST /api/resume-analyze` - Upload and analyze resume

### Mentors
- `GET /api/mentors` - Get all mentors

### Chatbot
- `POST /api/chatbot` - Get chatbot response

### User Profile (Protected)
- `GET /api/user/profile` - Get user profile

## Database Models

- **User**: Authentication, preferences, test history, resume analysis
- **Company**: Profile, hiring info, roles, internships
- **Skill**: Categories, resources, tests
- **Course**: Learning content, roadmaps
- **HigherStudy**: Study options, career paths
- **Test**: Assessment questions, scoring
- **Mentor**: Expert profiles, availability
- **ChatbotData**: Training data for AI responses

## Frontend Usage

1. Open `future.html` in a browser
2. Register/Login to access full features
3. Navigate through different modules
4. Use the AI chatbot for queries

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

3. **Start Backend Server**
   ```bash
   npm start
   ```

4. **Seed Database** (in another terminal)
   ```bash
   curl -X POST http://localhost:5000/api/seed
   ```

5. **Open Frontend**
   - Open `future.html` in your browser
   - The app will connect to `http://localhost:5000`

## Features Implemented

✅ **Complete Backend API** with JWT Authentication
✅ **Companies Module** - Profiles, packages, internships
✅ **Skills Module** - Technical, communication, soft skills
✅ **Courses Module** - Learning paths and roadmaps
✅ **Higher Studies** - M.Tech, MBA, MS options
✅ **Job Predictor** - Resume analysis (mock AI)
✅ **Mentors** - Expert connections
✅ **AI Chatbot** - Career guidance
✅ **User Authentication** - Signup/Login with JWT
✅ **Responsive Frontend** - HTML + Tailwind CSS

## API Testing

Test the APIs using curl or Postman:

```bash
# Seed data
curl -X POST http://localhost:5000/api/seed

# Get companies
curl http://localhost:5000/api/companies

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Production Deployment

1. Set environment variables in `.env`
2. Use MongoDB Atlas for database
3. Add OpenAI API key for real AI features
4. Configure Twilio for OTP
5. Deploy backend to Heroku/Railway/Vercel
6. Host frontend on Netlify/Vercel

## Future Enhancements

- [ ] React frontend migration
- [ ] Real AI integration (OpenAI GPT)
- [ ] Video calling for mentors
- [ ] Job portal integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard