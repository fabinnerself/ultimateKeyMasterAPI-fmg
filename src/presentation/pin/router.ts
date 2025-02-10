import { Router } from "express";
import { RepairService } from "../services/repair.service";
import { PinService} from "../services/pin.service"
import { UserService } from "../services/user.service";
import { CredentialService} from "../services/credential.service"
import { BoxService} from "../services/box.service"
import { PinController} from "./controller"
import { EmailService } from "../services/email.service";
import { envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class PinRoutes {
  static get routes(): Router {
    const router = Router();    

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );

    const userService = new UserService(emailService)
    const boxService = new BoxService(userService)
    const credentialService = new CredentialService(boxService)
    const pinService = new PinService(credentialService)    
    const pinController = new PinController(pinService)
 
    router.use(AuthMiddleware.protect);
    router.post("/", pinController.createPin);        
    router.post("/:id", pinController.noIdRepair);    
    router.get("/", pinController.findAllPins);
    router.get("/:id", pinController.findOnePin);
    router.delete("/", pinController.validPin);
    router.delete("/:id", pinController.deletePin);
    router.patch("/", pinController.validPin);     
    router.patch("/", pinController.validPin);
    router.patch("/:id", pinController.updatePin);
    
    return router;
  }
}
