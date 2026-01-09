const mongoose = require('mongoose');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/futurehire');

    // Import models
    const Company = require('./models/Company');
    const Skill = require('./models/Skill');
    const Course = require('./models/Course');
    const HigherStudy = require('./models/HigherStudy');
    const Test = require('./models/Test');
    const Mentor = require('./models/Mentor');
    const ChatbotData = require('./models/ChatbotData');

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
      }
    ];

    await Company.insertMany(companies);
    console.log('Companies seeded');

    // Add more seeding as needed...

    console.log('Data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();