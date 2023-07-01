import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path"; // no need to install
import { fileURLToPath } from "url";
import {register} from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import {createPost} from "./controllers/posts.js";
import { verifyToken } from "./middlewares/auth.js";
import User from  "./models/User.js";
import Post from "./models/Post.js";
import {users, posts} from "./data/index.js";

// Configurations// *  --> Middle ware configurations
// At any event we call it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config(); // this is necessary to write  process.env
const app = express(); // here we use express library
app.use(express.json()); // this will do parsing of Http request
app.use(helmet());   // this will enable helmet when request has been sent to our code/project
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));  // this enables ,when we hit the url to get data from frontend then it will do proper connectivity bw frontend and backend running on differentp ports;
app.use(morgan('common'));
app.use(bodyParser.json({limit: "30mb",extended :true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors()); 
app.use("/assets",express.static(path.join(__dirname,'public/assets')));

/*File Storage */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });


  /* Routes with Files*/
  app.post("/auth/register",upload.single("picture"),register); // data go into database;  
  // as here we use upload function that is wly we cant put it on routes
  app.post("/posts",verifyToken,upload.single("picture"),createPost);

/* Routes*/  
app.use("/auth",authRoutes); 
app.use("/users",userRoutes);
app.use("/posts",postRoutes);

  /* Mongoose Setup*/
  const PORT = process.env.PORT || 5001;
  mongoose.connect(process.env.MONGO_URL,
    {
      useNewUrlParser: true,
     //useFindAndModify: false,
      useUnifiedTopology: true
    }
  ).then(()=>{
    app.listen(PORT,()=> console.log(`Server Port:${PORT},Database Connected`)) 
    /*Manually Injecting Data*/

    // User.insertMany(users);
     //Post.insertMany(posts);

  }).catch((error)=> console.log(`Database not connected ${error}`));
  