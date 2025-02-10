import { Router } from "express";
import { BoxController } from "./controller";
import { UserService } from "../services/user.service";
import { EmailService } from "../services/email.service";
import { BoxService } from "../services/box.service";
import { envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class BoxRoutes {
  static get routes(): Router {
    const router = Router();
    
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );

    const userService = new UserService(emailService);
    const boxService = new BoxService(userService);
    const boxController = new BoxController(boxService);    

    router.use(AuthMiddleware.protect);
      router.post("/", boxController.createBox);        
      router.post("/:id", boxController.noIdBox);    
      router.get("/:id/:order/:favorites", boxController.findAllBox);
      router.get("/:id", boxController.findOneBox);
      router.delete("/", boxController.validBox);
      router.delete("/:id", boxController.deleteBox);
      router.patch("/", boxController.validBox);           
      router.patch("/:id", boxController.updateBox); 
    
    return router;
  }
}
