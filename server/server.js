require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const router = express.Router();
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");             
const superAdminRoutes = require("./routes/superAdminRoutes");  
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/superadmin", superAdminRoutes);

app.use("/uploads", express.static("uploads"));


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
