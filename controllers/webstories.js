import WebStory from "../models/webstory.js";
import slugify from "slugify";
import moment from "moment-timezone"


export const createWebStory = async (req, res) => {
  upload.none()(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: 'Something went wrong'
      });
    }

    const { title, description, slug, coverphoto, slides, link, lastimage, lastheading, ads } = req.body;


    if (!title || title.length > 69) {
      return res.status(400).json({
        error: 'Title is required and should be less than 70 characters'
      });
    }

    if (!description || description.length > 200) {
      return res.status(400).json({
        error: 'Description is required and should be less than 200 characters'
      });
    }

    // if (!date) {
    //   return res.status(400).json({
    //     error: 'Date is required'
    //   });
    // }

    if (!slug) {
      return res.status(400).json({
        error: 'Slug is required'
      });
    }

    if (!coverphoto) {
      return res.status(400).json({
        error: 'Cover photo is required'
      });
    }
    if (!slides) {
      return res.status(400).json({
        error: 'Slides is required'
      });
    }


    let story = new WebStory();
    story.title = title;
    story.slug = slugify(slug).toLowerCase();
    story.description = description;
    story.coverphoto = coverphoto;
    // story.date = date;
    const currentDateTimeIST = moment().tz('Asia/Kolkata').format();
    story.date = currentDateTimeIST;
    story.slides = JSON.parse(slides);
    story.link = link;
    story.lastheading = lastheading;
    story.lastimage = lastimage;
    story.ads = ads;

    try {
      const savedStory = await story.save();
      return res.status(201).json(savedStory);
    } catch (error) {
      console.error("Error creating web story:", error);
      return res.status(500).json({ error: "Slug should be unique" });
    }
  });

  fetch(`${process.env.MAIN_URL}/api/revalidate?path=/${story.slug}`, {
    method: 'POST',
  })
};



export const fetchWebStoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const webStory = await WebStory.findOne({ slug });

    if (!webStory) {
      return res.status(404).json({ error: 'Web story not found' });
    }

    res.json(webStory);
  } catch (error) {
    console.error('Error fetching web story by slug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





export const allstories = async (req, res) => {
  try {
    const data = await WebStory.find({})
      .sort({ date: -1 })
      .select('title slug date coverphoto description')
      .limit(12)
      .exec();

    res.json(data);
  } catch (err) {
    return res.json({
      error: "Something Went Wrong"
    });
  }
};


export const allslugs = async (req, res) => {
  try {
    const data = await WebStory.find({})
      .sort({ date: -1 })
      .select('slug')
      .exec();

    res.json(data);
  } catch (err) {
    return res.json({
      error: "Something Went Wrong"
    });
  }
};


export const sitemap = async (req, res) => {
  try {
    const data = await WebStory.find({})
      .sort({ date: -1 })
      .select('title slug date coverphoto')
      .exec();

    res.json(data);
  } catch (err) {
    return res.json({
      error: "Something Went Wrong"
    });
  }
};




export const deletestory = async (req, res) => {
  const slug = req.params.slug.toLowerCase();

  try {
    const data = await WebStory.findOneAndRemove({ slug }).exec();

    if (!data) {
      return res.status(404).json({
        error: 'WebStory not found'
      });
    }

    res.json({
      message: 'WebStory deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      error: errorHandler(err)
    });
  }

  fetch(`${process.env.MAIN_URL}/api/revalidate?path=/${slug}`, {
    method: 'POST',
  })
};



export const updateStory = async (req, res) => {
  upload.none()(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: 'Something went wrong'
      });
    }

    const updateFields = req.body;

    try {
      const slug = req.params.slug.toLowerCase();
      if (!slug) {
        return res.status(404).json({ error: 'Story not found' });
      }
      let story = await WebStory.findOne({ slug }).exec();

      const currentDateTimeIST = moment().tz('Asia/Kolkata').format();
      story.date = currentDateTimeIST;

      Object.keys(updateFields).forEach((key) => {
        if (key === 'title') {
          story.title = updateFields.title;
        } else if (key === 'description') {
          story.description = updateFields.description;
        } else if (key === 'slug') {
          story.slug = slugify(updateFields.slug).toLowerCase();
        } else if (key === 'coverphoto') {
          story.coverphoto = updateFields.coverphoto;
        } else if (key === 'ads') {
          story.ads = updateFields.ads;
        } else if (key === 'slides') {
          story.slides = JSON.parse(updateFields.slides);
        } else if (key === 'link') {
          story.link = updateFields.link;
        }
        else if (key === 'lastimage') {
          story.lastimage = updateFields.lastimage;
        }
        else if (key === 'lastheading') {
          story.lastheading = updateFields.lastheading;
        }
      });

      const savedStory = await story.save();
      return res.status(200).json(savedStory);
    } catch (error) {
      console.error("Error updating web story:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  fetch(`${process.env.MAIN_URL}/api/revalidate?path=/${story.slug}`, {
    method: 'POST',
  })
};