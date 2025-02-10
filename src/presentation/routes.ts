import { Router } from "express";
import { UserRoutes } from "./user/route";
import { BoxRoutes } from "./box/route";
import { CredentialRoutes } from "./credential/route"
import {PinRoutes} from "./pin/router"

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/users", UserRoutes.routes);
    router.use("/api/box", BoxRoutes.routes);
    router.use("/api/credential", CredentialRoutes.routes);   
    router.use("/api/pin", PinRoutes.routes); 

    return router;
  }
}
