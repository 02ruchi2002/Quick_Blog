import jwt from 'jsonwebtoken'

const auth = (req,resp,next) =>{
   const token = req.headers.authorization
   try {

      jwt.verify(token,process.env.JWT_SECRET)
      next()

   } catch (error) {
      
    resp.json({
        success:false,
        message:"invalid token"
    })
   }
}

export default auth