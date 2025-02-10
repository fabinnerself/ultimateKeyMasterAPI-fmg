import { regularExp } from "../../../config";

export class RegisterPinDTO {
    constructor(
        public pin: string,
        public idCredential: string 
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterPinDTO?] {
        const { pin, idCredential } = object;

        if (!pin) return ["Missing pin"];
        if (!regularExp.pinVal.test(pin))
            return [
                "The PIN must be either 1 or 6 characters long",
            ];


        if (!regularExp.uuid.test(idCredential))
            return [
                "The Credential id format is not valid",
            ];

     

        return [
            undefined,
            new RegisterPinDTO(pin, idCredential),
        ];
    }
}