import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ====== MongoDB Connection ======
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ====== USER MODEL ======
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// ====== AUTH MIDDLEWARE (JWT Validation) ======
const authMiddleware = (req, res, next) => {
  try {
    // 1. Check for token in the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication failed: No token provided." });
    }

    // 2. Extract the token
    const token = authHeader.split(" ")[1];

    // 3. Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user ID to the request object
    req.user = { id: decodedToken.id };
    
    // 5. Pass to the next middleware/route handler
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Authentication failed: Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Authentication failed: Token expired." });
    }
    res.status(500).json({ error: "Server error during authentication." });
  }
};


// ====== SIGNUP ======
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // --- Create token for new user (same as login) ---
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // --- Return token and user info (matching frontend expectation) ---
    res.status(201).json({ 
      token, 
      user: { id: newUser._id, name: newUser.name, email: newUser.email } 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ====== LOGIN ======
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ====== PROTECTED DASHBOARD ROUTE ======
// This route is now protected by the authMiddleware
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  try {
    // We can get the user's ID from req.user, which was set by the middleware
    const user = await User.findById(req.user.id).select("-password"); // Find user, exclude password
    if (!user) {
      return res.status(404).json({ message: "User data not found." });
    }

    // Send back some protected data
    res.json({
      message: `Welcome to your dashboard, ${user.name}!`,
      userData: {
        name: user.name,
        email: user.email,
        joined: user._id.getTimestamp() // Example of protected info
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("Donation Backend Running Successfully 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
