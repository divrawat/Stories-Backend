import express from "express";
import multer from "multer";
const router = express.Router();
import { requireSignin, adminMiddleware } from "../controllers/auth.js"
import { createWebStory, fetchWebStoryBySlug, allstories, deletestory, updateStory, sitemap, allslugs } from "../controllers/webstories.js";

router.post('/webstory', requireSignin, adminMiddleware, createWebStory);
router.get('/webstories/:slug', fetchWebStoryBySlug);
router.get('/allwebstories', allstories);
router.get('/allslugs', allslugs);
router.get('/sitemap', sitemap);
router.delete('/webstorydelete/:slug', requireSignin, adminMiddleware, deletestory);
router.patch('/webstoriesupdate/:slug', requireSignin, adminMiddleware, updateStory);



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ '-' + file.originalname  );
    },
  });
  
  const upload = multer({storage: storage});  
  const cpUpload = upload.fields([{ name: 'images', maxCount: 15 }])


  router.post('/images', cpUpload, function (req, res, next) {
  res.send('Images uploaded successfully!');

  })

export default router;