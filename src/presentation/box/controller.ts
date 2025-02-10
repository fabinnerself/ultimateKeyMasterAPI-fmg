import { Request, Response } from "express";
import { BoxService } from "../services/box.service";
import { CustomError, RegisterBoxDTO, UpdateBoxDTO , ListBoxDTO } from "../../domain";
import { regularExp } from "../../config";


export class BoxController {
  constructor(private readonly boxService: BoxService) { }

  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);

    return res.status(500).json({ message: "Something went very wrong on box service! 🧨" });
  };

  findAllBox = (req: Request, res: Response) => {
    // const { id, order,favorites } = req.params;

    const [error, listBoxDTO] = ListBoxDTO.create(req.params);

    if (error) return res.status(422).json({ message: error });

    this.boxService
      .findAllBoxServ(listBoxDTO!)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  findOneBox = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!regularExp.uuid.test(id))
      return  res.status(404).json({ message: "Security Box Id not found" });

    this.boxService
      .findOneBoxServ(id)
      .then((data: any) => {
        res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  deleteBox = (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id) return res.status(422).json({ message: "Missing Service Box Id to delete" });

    this.boxService
      .deleteBoxServ(id)
      .then((data: any) => {
        return res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  createBox = (req: Request, res: Response) => {
    const [error, createBoxDTO] = RegisterBoxDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.boxService
      .createBoxServ(createBoxDTO!)
      .then((data: any) => {
        return res.status(201).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };


  updateBox = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!regularExp.uuid.test(id))
      return  res.status(422).json({ message: "Bad format of the Security Box Id" });
    // console.log("body param",req.body)

    const [error, updateBoxDTO] = UpdateBoxDTO.create(req.body);
    if (error) return res.status(422).json({ message: error });

    this.boxService
      .updateBoxServ(id, updateBoxDTO!)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error: any) => {
        this.handleError(error, res)

      });
  };

  validBox = (req: Request, res: Response) => {
    return res.status(400).json({
      error: "Missing ID parameter. Please provide a user ID in the URL.",
      example: "/api/v1/repair/:id"
    });
  };

  noIdBox = (req: Request, res: Response) => {
    return res.status(400).json({
      message: "Do not need to provide a security box id parameter when creating a new box record."
    });
  };

}
