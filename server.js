const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS (MUST BE FIRST)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ROUTES
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
const symptomRoutes = require("./routes/symptomRoutes");

app.use("/api/symptoms", symptomRoutes);
app.use("/api/online-symptoms", require("./routes/onlineSymptomRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/surgeries", require("./routes/surgeryRoutes"));
const subCategoryRoutes = require("./routes/subCategoryRoutes");
app.use("/api/subcategories", subCategoryRoutes);
const medicineItemRoutes = require("./routes/medicineItemRoutes");

app.use("/api/medicineItem", medicineItemRoutes);
const labCategoryRoutes = require("./routes/labCategoryRoutes");
app.use("/api/labCategories", labCategoryRoutes);
// ✅ DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});