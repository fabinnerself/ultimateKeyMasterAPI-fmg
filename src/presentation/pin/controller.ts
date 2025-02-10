import { Request, Response } from "express";
import { PinService } from "../services/pin.service";
import { CustomError, RegisterPinDTO, UpdatePinDTO } from "../../domain";
import { regularExp } from "../../config";

export class PinController {
  constructor(private readonly pinService: PinService) { }

  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);


    return res.status(500).json({ message: "Something went very wrong! 🧨" });
  };

  findAllPins = (req: Request, res: Response) => {
    this.pinService
      .findAllPinServ()
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  findOnePin = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id)
      return res.status(422).json({ message: "Missing pin Id" });
    if (!regularExp.uuid.test(id))
      return res.status(422).json({ message: "Bad format of the Pin Id" });

    this.pinService
      .findOnePinServ(id)
      .then((data: any) => {
        res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  deletePin = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id)
      return res.status(422).json({ message: "Missing Pin Id" });
    if (!regularExp.uuid.test(id))
      return res.status(422).json({ message: "Bad format of the Pin Id" });


    this.pinService
      .deletePinServ(id)
      .then((data: any) => {
        return res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  createPin = (req: Request, res: Response) => {
    const [error, createRepairDTO] = RegisterPinDTO.create(req.body);
    if (error) return res.status(422).json({ message: error });

    this.pinService
      .createPinServ(createRepairDTO!)
      .then((data: any) => {
        return res.status(201).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };


  updatePin = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id)
      return res.status(422).json({ message: "Missing Pin Id" });
    if (!regularExp.uuid.test(id))
      return res.status(422).json({ message: "Bad format of the Pin Id" });

    const [error, updatePinDTO] = UpdatePinDTO.create(req.body);
    if (error) return res.status(422).json({ message: error });


    this.pinService
      .updatePinServ(id, updatePinDTO!)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error: any) => {
        this.handleError(error, res)

      });
  };

  validPin = (req: Request, res: Response) => {
    return res.status(400).json({
      error: "Missing ID parameter. Please provide a pin ID in the URL.",
      example: "/api/pin/:id"
    });
  };

  noIdPin = (req: Request, res: Response) => {
    return res.status(400).json({
      message: "Do not need to provide a repair id parameter when creating a new pin account."
    });
  };

}
