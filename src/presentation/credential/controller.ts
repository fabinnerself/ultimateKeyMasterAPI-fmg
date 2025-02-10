import { Request, Response } from "express";
import { CredentialService } from "../services/credential.service";
import { CustomError, RegisterCredentialDTO, UpdateCredentialDTO } from "../../domain";
import { regularExp } from "../../config";



export class CredentialController {
  constructor(private readonly credentialService: CredentialService) { }

  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);

    return res.status(500).json({ message: "Something went very wrong on credentials! 🧨" });
  };

  findAllCredential = (req: Request, res: Response) => {
    const { idBox } = req.params;

    if (!idBox) return res.status(422).json({ message: "Missing Box Id" });
    if (!regularExp.uuid.test(idBox))
      return res.status(422).json({ message: "Bad format of the Box Id" });

    this.credentialService
      .findAllCredentialServ(idBox)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  findOneCredential = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!regularExp.uuid.test(id))
      return res.status(404).json({ message: "Credential Id not found" });

    this.credentialService
      .findOneCredentialServ(id)
      .then((data: any) => {
        res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  deleteCredential = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(422).json({ message: "Missing Credential Id to delete" });
    if (!regularExp.uuid.test(id))
      return res.status(422).json({ message: "Bad format of the Credential Id" });

    this.credentialService
      .deleteCredentialServ(id)
      .then((data: any) => {
        return res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  createCredential = (req: Request, res: Response) => {
    const [error, createCredentialDTO] = RegisterCredentialDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.credentialService
      .createCredentialServ(createCredentialDTO!)
      .then((data: any) => {
        return res.status(201).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };


  updateCredential = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id)
      return res.status(422).json({ message: "Missing Credential Id" });
    if (!regularExp.uuid.test(id))
      return res.status(422).json({ message: "Bad format of the Credential Id" });
    // console.log("body param",req.body)

    const [error, updtCredentialDTO] = UpdateCredentialDTO.create(req.body);
    if (error) return res.status(422).json({ message: error });

    this.credentialService
      .updateCredentialServ(id, updtCredentialDTO!)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error: any) => {
        this.handleError(error, res)

      });
  };

  validCredential = (req: Request, res: Response) => {
    return res.status(400).json({
      error: "Missing ID parameter. Please provide a credential ID in the URL.",
      example: "/api/credential/:id"
    });
  };

  noIdCredential = (req: Request, res: Response) => {
    return res.status(400).json({
      message: "Do not need to provide a credential id parameter when creating a new credential record."
    });
  };

  genereateCredential = (req: Request, res: Response) => {

    this.credentialService
      .generateCredentialServ()
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error: any) => {
        this.handleError(error, res)

      });
  };



}
