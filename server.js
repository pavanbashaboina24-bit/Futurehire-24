const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/futurehire', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Models
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String,
  preferences: Object,
  testHistory: [Object],
  resumeAnalysis: Object,
  createdAt: { type: Date, default: Date.now }
});

const CompanySchema = new mongoose.Schema({
  name: String,
  type: String,
  est: Number,
  hq: String,
  role: String,
  pkg: String,
  history: String,
  branches: [String],
  hiringPattern: Object,
  requiredSkills: [String],
  fresherRoles: [Object],
  internshipUrl: String
});

const SkillSchema = new mongoose.Schema({
  category: String, // technical, communication, soft
  name: String,
  learningResources: {
    free: [String],
    paid: [String]
  },
  tests: [Object]
});

const CourseSchema = new mongoose.Schema({
  title: String,
  icon: String,
  color: String,
  desc: String,
  playlist: [String],
  notes: [String],
  roadmap: [String]
});

const HigherStudySchema = new mongoose.Schema({
  name: String,
  benefits: String,
  courses: [Object],
  afterCompletion: Object
});

const TestSchema = new mongoose.Schema({
  title: String,
  difficulty: String,
  questions: [Object],
  timeLimit: Number
});

const MentorSchema = new mongoose.Schema({
  name: String,
  experience: String,
  domain: String,
  availability: String,
  pricing: Number,
  isPaid: Boolean
});

const ChatbotDataSchema = new mongoose.Schema({
  question: String,
  answer: String,
  category: String
});

const User = mongoose.model('User', UserSchema);
const Company = mongoose.model('Company', CompanySchema);
const Skill = mongoose.model('Skill', SkillSchema);
const Course = mongoose.model('Course', CourseSchema);
const HigherStudy = mongoose.model('HigherStudy', HigherStudySchema);
const Test = mongoose.model('Test', TestSchema);
const Mentor = mongoose.model('Mentor', MentorSchema);
const ChatbotData = mongoose.model('ChatbotData', ChatbotDataSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, mobile, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ message: 'User created', token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Companies Routes
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/companies/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Skills Routes
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/skills/:category', async (req, res) => {
  try {
    const skills = await Skill.find({ category: req.params.category });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Courses Routes
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Higher Studies Routes
app.get('/api/higher-studies', async (req, res) => {
  try {
    const studies = await HigherStudy.find();
    res.json(studies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/higher-studies/:id', async (req, res) => {
  try {
    const study = await HigherStudy.findById(req.params.id);
    res.json(study);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tests Routes
app.get('/api/tests', authenticateToken, async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tests/:id', authenticateToken, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tests/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    // Simple scoring logic - implement proper scoring
    const score = Math.floor(Math.random() * 100);
    const result = { score, answers };
    
    await User.findByIdAndUpdate(req.user.id, { 
      $push: { testHistory: { testId: req.params.id, result, date: new Date() } }
    });
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resume Analysis Route
app.post('/api/resume-analyze', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    // Mock AI analysis - in real implementation, use OpenAI or similar
    const analysis = {
      skills: ['JavaScript', 'React', 'Node.js'],
      projects: ['E-commerce Website', 'Portfolio Site'],
      weakPoints: ['Lack of experience in backend databases'],
      suggestions: ['Add more technical projects', 'Improve resume formatting'],
      roleSuggestions: ['Frontend Developer', 'Full Stack Developer'],
      companyMatches: ['Google', 'Microsoft', 'Amazon']
    };
    
    await User.findByIdAndUpdate(req.user.id, { resumeAnalysis: analysis });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mentors Routes
app.get('/api/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chatbot Route
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    // Mock chatbot response - in real implementation, use OpenAI
    const response = `Based on your question "${message}", here's some guidance on placement and careers.`;
    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Profile Route
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed data (run once)
app.post('/api/seed', async (req, res) => {
  try {
    // Seed companies
    const companies = [
      { 
        name: "TCS", 
        type: "Service", 
        est: 1968, 
        hq: "Mumbai", 
        role: "Ninja / Digital", 
        pkg: "3.6 - 7.0 LPA", 
        history: "Tata Consultancy Services is a leading IT services company.", 
        branches: ["Mumbai", "Delhi", "Bangalore"], 
        hiringPattern: { cgpa: "6.0+", dsa: "Basic", projects: "Preferred", communication: "Good" }, 
        requiredSkills: ["Java", "Python", "SQL"],
        fresherRoles: [
          { role: "Software Engineer", salary: "3.6 LPA", skills: ["Java", "Python"] },
          { role: "System Engineer", salary: "3.8 LPA", skills: ["Networking", "Linux"] }
        ],
        internshipUrl: "https://www.tcs.com/careers/internship"
      },
      { 
        name: "Amazon", 
        type: "Product", 
        est: 1994, 
        hq: "Seattle", 
        role: "SDE", 
        pkg: "8.0 - 15.0 LPA", 
        history: "Amazon is a multinational technology company.", 
        branches: ["Bangalore", "Hyderabad", "Gurgaon"], 
        hiringPattern: { cgpa: "7.0+", dsa: "Advanced", projects: "Required", communication: "Excellent" }, 
        requiredSkills: ["DSA", "System Design", "Java/C++"],
        fresherRoles: [
          { role: "Software Development Engineer", salary: "12 LPA", skills: ["DSA", "System Design"] }
        ],
        internshipUrl: "https://www.amazon.jobs/en/teams/internship"
      }
    ];
    await Company.insertMany(companies);

    // Seed skills
    const skills = [
      {
        category: "technical",
        name: "Data Structures & Algorithms",
        learningResources: {
          free: ["https://www.youtube.com/watch?v=0IAPZzGSbME", "https://www.geeksforgeeks.org/data-structures/"],
          paid: ["https://www.udemy.com/course/data-structures-and-algorithms-deep-dive-using-java/", "https://www.coursera.org/specializations/data-structures-algorithms"]
        },
        tests: [
          { name: "Practice Test", url: "https://www.geeksforgeeks.org/practice/" },
          { name: "Mock Test", difficulty: "Medium", questions: 4, timeLimit: 60 }
        ]
      },
      {
        category: "communication",
        name: "English Speaking",
        learningResources: {
          free: ["https://www.youtube.com/watch?v=0IAPZzGSbME"],
          paid: ["https://www.udemy.com/course/communication-skills/"],
        },
        tests: []
      }
    ];
    await Skill.insertMany(skills);

    // Seed courses
    const courses = [
      { 
        title: "Web Development", 
        icon: "ph-globe", 
        color: "bg-blue-100 text-blue-600", 
        desc: "Master HTML, CSS, JS & React.", 
        playlist: ["HTML/CSS Basics", "JS Fundamentals", "React Basics"], 
        notes: ["DOM Manipulation", "CSS Box Model", "React Components"],
        roadmap: ["HTML/CSS", "JavaScript", "Frontend Framework", "Backend", "Deployment"]
      },
      { 
        title: "Data Science", 
        icon: "ph-chart-bar", 
        color: "bg-green-100 text-green-600", 
        desc: "Learn Python, ML & Data Analysis.", 
        playlist: ["Python Basics", "Pandas", "Machine Learning"], 
        notes: ["Data Cleaning", "Visualization", "ML Algorithms"],
        roadmap: ["Python", "Statistics", "ML", "Deep Learning", "Projects"]
      }
    ];
    await Course.insertMany(courses);

    // Seed higher studies
    const higherStudies = [
      {
        name: "M.Tech",
        benefits: "Advanced technical knowledge, better job prospects, higher salary",
        courses: [
          { name: "M.Tech CSE", duration: "2 years", eligibility: "B.Tech with 60%" },
          { name: "M.Tech AI", duration: "2 years", eligibility: "B.Tech with 65%" }
        ],
        afterCompletion: {
          jobOptions: ["Senior Engineer", "Research Scientist", "Professor"],
          careerPaths: ["R&D", "Academia", "Industry"],
          salaryRange: "8-20 LPA"
        }
      },
      {
        name: "MBA",
        benefits: "Business acumen, leadership skills, networking",
        courses: [
          { name: "MBA Finance", duration: "2 years", eligibility: "Bachelor's degree" },
          { name: "MBA Marketing", duration: "2 years", eligibility: "Bachelor's degree" }
        ],
        afterCompletion: {
          jobOptions: ["Manager", "Consultant", "Entrepreneur"],
          careerPaths: ["Corporate", "Consulting", "Startup"],
          salaryRange: "10-25 LPA"
        }
      }
    ];
    await HigherStudy.insertMany(higherStudies);

    // Seed tests
    const tests = [
      {
        title: "Technical Skills Assessment",
        difficulty: "Medium",
        questions: [
          { question: "What is the time complexity of quicksort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: 1 },
          { question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Array", "Linked List"], answer: 1 }
        ],
        timeLimit: 60
      }
    ];
    await Test.insertMany(tests);

    // Seed mentors
    const mentors = [
      {
        name: "John Doe",
        experience: "10 years",
        domain: "Software Development",
        availability: "Weekends",
        pricing: 500,
        isPaid: true
      },
      {
        name: "Jane Smith",
        experience: "8 years",
        domain: "Data Science",
        availability: "Evenings",
        pricing: 0,
        isPaid: false
      }
    ];
    await Mentor.insertMany(mentors);

    // Seed chatbot data
    const chatbotData = [
      { question: "What skills needed for Amazon?", answer: "Amazon requires strong DSA, System Design, and coding skills in Java/C++.", category: "companies" },
      { question: "How to prepare for placements?", answer: "Focus on DSA, projects, communication skills, and practice coding regularly.", category: "general" }
    ];
    await ChatbotData.insertMany(chatbotData);

    res.json({ message: 'Data seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});