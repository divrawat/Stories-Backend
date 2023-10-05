import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import  mongoose from "mongoose";
import "dotenv/config.js";
import cors from "cors";

// Bringing Routes
 import storyRoutes from "./routes/slides.js";
import authRoutes from "./routes/user.js";




// app
const app = express();
app.use(cors());


mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));



// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));


 app.use('/api', storyRoutes);
 app.use('/api', authRoutes);




app.get('/', (req, res) => {
    res.json("Backend Index Of my website");
});

app.get('/api', (req, res) => {
  res.json("Backend API Of my website");
});


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});