import fs from "fs";
import express from "express";
import multer from "multer";
import csv from "fast-csv";
import path from "path";
import { fileURLToPath } from "url";
import Content from "../models/content.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(express.static(__dirname));

router.get("/uploadData",async (req,res) => {
    res.render("index");
});

router.post("/postData", upload.any(), async (req,res) => {
    try{
        if (req.files[0] === undefined) { 
            return res.json({
              status: "FAILED",
              message: "Please select a file to upload data to DB!",
            });
          }
          // Open uploaded file
          csv.parseFile(req.files[0].path).on("data", async (data) => {
            const individalData = {
              id: data[0],
              tweet_id: data[1],
              content: data[2],
              username: data[3],
              read: false,
            };
            const content = await Content.findOne(individalData);
            // Avoiding Duplicate Data
            if (!content) {
              const newContent = new Content(individalData);
              await newContent.save();
            }
          }).on("end", () => {
            fs.unlinkSync(req.files[0].path);
            res.json({
              status: "STATUS",
              message: "Data has been appended to the DB successfully!",
            })
          });

    }
    catch(error){
        console.log(error);
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
});

router.get("/showContent", async(req,res) => {
    const content = await Content.findOne({read: false});
    // console.log(content);
    if(!content){
      return res.json({
        status: "FAILED",
        message: "Content does not Exist!",
      });
    }
    return res.render("show",{tweet: content.content, username: content.username, id: content._id});
    // return res.json({
    //   status: "SUCCESS",
    //   payload: {
    //     tweet: content.content,
    //     tweet_id: content.tweet_id,
    //     username: content.username,
    //     id: content._id,
    //   },
    // });
});

router.put("/updateContent/:id", async(req,res) => {
  const content = await Content.findOne({_id: req.params.id});
  
  content.value = req.body.value;
  content.read = true;
  await content.save();
  return res.redirect("/api/v1/content/showContent");
});


export default router;