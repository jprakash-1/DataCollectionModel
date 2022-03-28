import express from "express";
import { mongoose } from "mongoose";
import session from "express-session";
import MongoDBSession from "connect-mongodb-session";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";

import ContentRouter from "../DataCollectionModel/controllers/content.js";

const app = express();
const PORT = 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
// MongoDB Configuration
const mongo_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/testNLP";
mongoose
  .connect(mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log(err));


const sessionOptions = {
    name: "unsolvedtommorrow",
    secret: "prokect NLP",
    resave: true,
    saveUninitialized: true,
    cookie: {
        path: "/",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

const corsOptions = {
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

// Saving User Session to DB
app.use(session(sessionOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
  

// app.use(session({
//     secret: 'unsolvedtomorrow',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
// }));


// Body Parser
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello World!");
});

app.use("/model/",ContentRouter);

app.get("*", (req,res) => {
    res.send("404 No Page Found!");
});

app.listen(PORT, () => { 
    console.log(`Server running at ${PORT}`);
});