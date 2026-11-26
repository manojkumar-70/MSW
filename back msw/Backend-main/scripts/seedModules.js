import "dotenv/config";
import mongoose from "mongoose";
import Notice from "../src/models/Notice.js";
import Scholarship from "../src/models/Scholarship.js";
import Book from "../src/models/Book.js";

const runSeed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB for seeding...");

  if ((await Notice.countDocuments()) === 0) {
    await Notice.insertMany([
      {
        title: "Semester Examination Schedule Released",
        description: "The end-semester theory and practical examination timetable for MSW has been published. Please check your respective department notice board.",
        category: "Exam",
        isPinned: true,
      },
      {
        title: "Field Work Orientation Program",
        description: "Mandatory orientation session for all first-year MSW students on Monday at 10:00 AM in Seminar Hall A.",
        category: "Academic",
        isPinned: false,
      },
      {
        title: "Annual Community Outreach Camp",
        description: "Registrations are open for the 5-day rural community outreach camp. Contact your faculty mentor for details.",
        category: "Event",
        isPinned: false,
      },
    ]);
    console.log("Seeded sample notices.");
  }

  if ((await Scholarship.countDocuments()) === 0) {
    await Scholarship.insertMany([
      {
        name: "State Post-Matric Social Work Scholarship",
        provider: "Department of Social Welfare",
        eligibility: "MSW students with family income below ₹2.5 LPA and 75% attendance",
        amount: "₹25,000 / year",
        deadline: new Date("2026-12-31"),
        applyLink: "https://scholarships.gov.in",
        status: "Open",
      },
      {
        name: "Merit-cum-Means Institutional Grant",
        provider: "MSW Academic Trust",
        eligibility: "Top 10% academic performers in Semester 1 & 2",
        amount: "₹15,000 / semester",
        deadline: new Date("2026-12-15"),
        status: "Open",
      },
    ]);
    console.log("Seeded sample scholarships.");
  }

  if ((await Book.countDocuments()) === 0) {
    await Book.insertMany([
      {
        title: "Introduction to Social Work",
        author: "Rex A. Skidmore",
        isbn: "978-0205279456",
        category: "Social Work",
        totalCopies: 5,
        availableCopies: 5,
      },
      {
        title: "Community Organization & Social Action",
        author: "H.Y. Siddiqui",
        isbn: "978-8170334125",
        category: "Community Work",
        totalCopies: 4,
        availableCopies: 4,
      },
      {
        title: "Research Methodology in Social Sciences",
        author: "C.R. Kothari",
        isbn: "978-8122436235",
        category: "Research",
        totalCopies: 6,
        availableCopies: 6,
      },
    ]);
    console.log("Seeded sample library books.");
  }

  await mongoose.disconnect();
  console.log("Seeding complete.");
};

runSeed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
