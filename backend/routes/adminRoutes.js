const express=require('express')
const router=express.Router()
const {protect}=require('../middleware/authMiddleware')

const {getUsers,editUser,deleteUser,findUsers}=require('../controllers/userController')

router.get('/',protect,getUsers)
router.delete('/deleteUser/:id',deleteUser)
router.put('/editUser/:id',editUser)
router.get('/finduser/:id',findUsers)


module.exports=router;