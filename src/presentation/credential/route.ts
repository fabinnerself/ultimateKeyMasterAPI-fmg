import { Router } from "express";
import { CredentialController} from "./controller"
import { UserService } from "../services/user.service";
import { EmailService } from "../services/email.service";
import { BoxService } from "../services/box.service";
import { envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CredentialService } from "../services/credential.service";

export class CredentialRoutes {
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
    const credentialService = new CredentialService(boxService)
    const credentialController = new CredentialController(credentialService)  

    router.use(AuthMiddleware.protect);
      router.get("/generate/", credentialController.genereateCredential);
      router.post("/", credentialController.createCredential);        
      router.post("/:id", credentialController.noIdCredential);    
      router.get("/list/:idBox", credentialController.findAllCredential);      
      router.get("/:id", credentialController.findOneCredential);
      router.delete("/", credentialController.validCredential);
      router.delete("/:id", credentialController.deleteCredential);
      router.patch("/", credentialController.validCredential);           
      router.patch("/:id", credentialController.updateCredential); 
    
    return router;
  }
}
