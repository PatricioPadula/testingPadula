import {logger} from "../app.js"
import { UsersService } from "../services/users.service.js";
import {generateEmailToken, recoveryEmail} from "../helpers/gmail.js";
import {validateToken, createHash} from "../utils.js"

export class SessionsController{
    static redirectLogin = (req,res)=>{
        res.redirect("/login");
    };

    static failSignup = (req,res)=>{
        res.send("<p>No se pudo registrar al usuario, <a href='/registro'>intenta de nuevo</a></p>");
    };

    static renderProfile = (req,res)=>{
        const user = req.user;
        logger.info("user",user);
        res.render("profile", {user});
    };

    static failLogin = (req,res)=>{
        res.send("<p>No se pudo loguear al usuario, <a href='/login'>intenta de nuevo</a></p>");
    };

    static forgotPassword = async (req,res)=>{
        try {
            const {email} = req.body;
            //primero verificar que el usuario existe
            const user = await UsersService.getUserByEmail(email);
            if(!user){
                return res.json({status:"error", message:"No es posible restablecer la contraseña"})
            }
            //generamos el token con el link para este usuario
            const token = generateEmailToken(email,60*60)
            //enviar el mensaje al usuario con el enlace
            await recoveryEmail(req,email,token);
            res.send("Correo enviado, volver al inicio");
        } catch (error) {
            res.json({status:"error", message:"No es posible restablecer la contraseña"})
        }
    }

    static resetPassword = async(req,res)=>{
        try {
            const token = req.query.token;
            const {newPassword} = req.body;
            const validEmail = validateToken(token);
            if(validEmail){
                const user = await UsersService.getUserByEmail(validEmail);
                if(user){
                    user.password = createHash(newPassword);
                    await UsersService.updateUser(user._id,user);
                    res.send("Contraseña actualizada <a href='/login'>Ir al login</a>")
                }
            } else{
                return res.send("El token ya caduco, volver a intentarlo <a href='/forgot-password'>Restablecer contraseña</a>")
            }
        } catch (error) {
            res.send("No se pudo restablecer la contraseña, volver a intentarlo <a href='/forgot-password'>Restablecer contraseña</a>")
        }
    }
}