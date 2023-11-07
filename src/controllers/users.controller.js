import { UsersService } from "../services/users.service.js"


export class UsersController{
    static modifyRole = async (req,res)=>{
        try {
            const userId = req.params.uid; 
            const user = await UsersService.getUserById(userId);
            const userRole = user.role;
            if(userRole === "user"){
                user.role = "premium";
            } else if(userRole === "premium"){
                user.role = "user";
            } else{
                return res.json({status:"error", message:"No se puede cambiar el rol de este usuario"})
            }
            await UsersService.updateUser(user._id,user);
            return res.json({status:"error", message:`El nuevo rol del usuario es ${user.role}`})
        } catch (error) {
            res.json({status:"error", message:error.menssage})
        }
    }
}