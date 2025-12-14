import fs from "fs"
import imageKit from "../configs/imageKit.js"
import Blog from "../model/Blog.js"
import Comment from "../model/Comment.js"
import main from "../configs/gemini.js"


export const addBlog = async (req, resp) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog)

    const imageFile = req.file

    // check if all fields are present
    if (!title || !description || !category || !imageFile) {
      resp.status(400).json({
        success: false,
        message: "Missing Required Fields"
      })
    }

    const fileBuffer = fs.readFileSync(imageFile.path)

    // Upload Image to ImageKit
    const response = await imageKit.files.upload({
      file: fs.createReadStream(imageFile.path),
      fileName: imageFile.originalname,
      folder: "/blogs"
    })
     
    console.log('res',response)

    // optimization through imagekit URL transformation
    const optimizeImageUrl = imageKit.helper.buildSrc({
      urlEndpoint: `https://ik.imagekit.io/${response.fileId}`,
      src: `/blogs/${imageFile.originalname}`,
      transformation: [
        { quality: 'auto' },     // Auto Compression
        { format: 'webp' },      // convert to mordern format
        { width: '1280' }        // width resizing
      ]
    })

    console.log("op url",optimizeImageUrl)

    // const image = optimizeImageUrl;
    const image = response.url;

    //   blog modal 
    await Blog.insertOne({ title, subTitle, description, category, image, isPublished })

    resp.status(200).json({
      success: true,
      message: 'blog added successfully'
    })

  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ___________________________________________________________________

export const getAllBlogs = async (req, resp) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
    resp.status(200).json({
      success: true,
      blogs
    })

  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ________________________________________________________________________

export const getBlogById = async (req, resp) => {
  try {
    const { blogId } = req.params
    const blog = await Blog.findById(blogId)
    if (!blog) {
      resp.status(404).json({
        success: false,
        message: "Blog not found"
      })
    }
    resp.status(200).json({
      success: true,
      blog
    })
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ________________________________________________________________________

export const deleteBlogById = async (req, resp) => {
  try {
    const { id } = req.body
    await Blog.findByIdAndDelete(id)

    // Delete all Comments associated to this blog
    await Comment.deleteMany({ blog: id })

    resp.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    })

  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ________________________________________________________________________

export const togglePublish = async (req, resp) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id)
    blog.isPublished = !blog.isPublished
    await blog.save()
    resp.status(200).json({
      success: true,
      message: "Blog status updated"
    })
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ________________________________________________________________________

export const addComment = async (req, resp) => {
  try {
    const { blog, name, content } = req.body
    //   comment Modal
    await Comment.create({ blog, name, content })
    resp.status(200).json({
      success: true,
      message: "comment added for review"
    })
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message
    })
  }
}


// ________________________________________________________________________

export const getBlogComments = async(req, resp) => {
  try {
    const { blogId } = req.body
    const comments = await (await Comment.find({ blog: blogId, isApproved: true })).sort({ createdAt: -1 })
    resp.status(200).json({
      success: true,
      message: comments
    })
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ________________________________________________________________________

export const generateContent = async (req,resp)=>{
  try {
    const {prompt} = req.body;
    console.log(prompt)
    const content = await main( prompt + ' Generate a blog content for this topic in simple text format')
    console.log("generated content:",content)
    resp.status(200).json({success: true,content})
  } catch (error) {
    resp.status(500).json({success:false,message:error.message})
  }
}