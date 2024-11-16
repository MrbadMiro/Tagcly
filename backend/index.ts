import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import path from "path";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import orderRoutes from "./routes/orderRoutes";


app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/orders",orderRoutes);
// Serve static files from the 'uploads' directory located outside 'Backend'
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const PORT = process.env.PORT || 5000;

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
