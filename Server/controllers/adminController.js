import jwt from "jsonwebtoken"
import Blog from "../model/Blog.js"
import Comment from "../model/Comment.js"

export const adminLogin = async (req, resp) => {
  try {
    const { email, password } = req.body

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return resp.status(401).json({
        success: false,
        message: "invalid credentials"
      })
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET)
    resp.status(200).json({
      success: true,
      token
    })


  } catch (error) {
    resp.json({
      success: false,
      message: error.message

    })
  }
}

// _______________________________________________________________

export const getAllBlogsAdmin = async (req, resp) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 })
    resp.json({
      success: true,
      blogs
    })

  } catch (error) {
    resp.json({
      success: false,
      message: error.message

    })
  }
}


// _______________________________________________________________

export const getAllComments = async (req, resp) => {
  try {
    const comments = await Comment.find({}).populate('blog').sort({ createdAt: -1 })
    resp.json({
      success: true,
      comments
    })

  } catch (error) {
    resp.json({
      success: false,
      message: error.message

    })
  }
}

// _______________________________________________________________

export const getDashboard = async (req, resp) => {
  try {
    const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5);
    const blogs = await Blog.countDocuments()
    const comments = await Comment.countDocuments()
    const drafts = await Blog.countDocuments({isPublished:false})

    const dashboardData = {
      blogs,comments,drafts,recentBlogs
    }

    resp.json({
      success: true,
      dashboardData
    })

  } catch (error) {
    resp.json({
      success: false,
      message: error.message
    })
  }
}

// _______________________________________________________________

export const deleteCommentByID = async(req,resp) =>{
  try {
     const {id} = req.body
     await Comment.findByIdAndDelete(id)
     resp.json({
      success: true,
      message:"comment deleted successfully"
    })
  } catch (error) {
    resp.json({
      success: false,
      message: error.message
    })
  }
}


// _______________________________________________________________

export const approveCommentByID = async(req,resp) =>{
  try {
     const {id} = req.body
     await Comment.findByIdAndUpdate(id,{isApproved:true})
     resp.json({
      success: true,
      message:"comment approved successfully"
    })
  } catch (error) {
    resp.json({
      success: false,
      message: error.message
    })
  }
}