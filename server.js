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
    origin: ["http://localhost:3000", "http://localhost:3001",https://slategrey-antelope-556296.hostingersite.com,],
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
const paymentRoutes = require("./routes/paymentRoutes");
const petCategoryRoutes = require(
  "./routes/petCategoryRoutes"
);

const petProductRoutes = require(
  "./routes/petProductRoutes"
);
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
const surgeryCategoryRoutes = require("./routes/surgeryCategoryRoutes");
app.use("/api/surgery-categories", surgeryCategoryRoutes);
const labTestRoutes = require("./routes/labTestRoutes");
app.use("/api/lab-tests", labTestRoutes);
const checkupTypeRoutes = require(
  "./routes/checkupTypeRoutes"
);
app.use(
  "/api/checkup-types",
  checkupTypeRoutes
);
// ✅ DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});
app.use(
  "/api/pet-categories",
  petCategoryRoutes
);

app.use(
  "/api/pet-products",
  petProductRoutes
);
const offerRoutes = require("./routes/offerRoutes");

app.use("/api/offers", offerRoutes);
const featuredServiceRoutes = require(
  "./routes/featuredServiceRoutes"
);

app.use(
  "/api/featured-services",
  featuredServiceRoutes
);
// server.js

const healthPackageCategoryRoutes = require(
  "./routes/healthPackageCategoryRoutes"
);

app.use(
  "/api/health-package-category",
  healthPackageCategoryRoutes
);
// server.js

const healthPackageRoutes = require(
  "./routes/healthPackageRoutes"
);

app.use(
  "/api/health-package",
  healthPackageRoutes
);
// server.js

const profileRoutes = require(
  "./routes/profileRoutes"
);

app.use(
  "/api/profile",
  profileRoutes
);
const medicineOrderRoutes = require(
  "./routes/medicineOrderRoutes"
);

app.use(
  "/api/medicine-orders",
  medicineOrderRoutes
);
const labBookingRoutes = require(
  "./routes/labBookingRoutes"
);

app.use(
  "/api/lab-bookings",
  labBookingRoutes
);const petOrderRoutes = require(
  "./routes/petOrderRoutes"
);

app.use(
  "/api/pet-orders",
  petOrderRoutes
);
const walletRoutes = require("./routes/walletRoutes");
app.use("/api/wallet", walletRoutes);
app.use("/api/payment", paymentRoutes);
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
