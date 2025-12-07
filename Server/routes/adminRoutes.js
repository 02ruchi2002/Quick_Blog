import express from "express" 
import { adminLogin, approveCommentByID, deleteCommentByID, getAllBlogsAdmin, getAllComments, getDashboard } from "../controllers/adminController.js"
import auth from "../middlewares/auth.js"

const adminRouter = express.Router()

adminRouter.post("/login",adminLogin)

adminRouter.get("/comments",auth,getAllComments)

adminRouter.get("/blogs",auth,getAllBlogsAdmin)

adminRouter.get("/delete-comment",auth,deleteCommentByID)

adminRouter.post("/approve-comment",auth,approveCommentByID)

adminRouter.get("/dashboard",auth,getDashboard)


export default adminRouter