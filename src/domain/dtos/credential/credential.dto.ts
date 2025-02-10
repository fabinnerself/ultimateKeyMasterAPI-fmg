import { regularExp } from "../../../config";

export class RegisterCredentialDTO {
    constructor(
        public name: string,
        public password: string,
        public description: string,
        public code1: string,
        public code2: string,
        public idBox: string
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterCredentialDTO?] {
        const { name, password, description, code1, code2, idBox } = object;

        if (!name) return ["Missing credential name"];
        if (!regularExp.nameBox.test(name))
            return [
                "The Credential name account must be between 3 an 100 characters long",
            ];

        if (!password) return ["Missing credential password"];
        //TODO al finalizar habilitar
        // if (!regularExp.password.test(password))
        //   return [
        //     "The credential password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, and one special character ",
        //   ];      


        if (!description) return ["Missing credential description"];
        if (!regularExp.nameBox.test(description))
            return [
                "The Credential description must be between 3 an 100 characters long",
            ];

        if (!regularExp.code.test(code1))
            return [
                "The Credential code I must be between 2 an 20 characters long",
            ];

        if (!regularExp.code.test(code2))
            return [
                "The Credential code II must be between 2 an 20 characters long",
            ];

        if (!idBox) return ["Missing credential id security box "];
        if (!regularExp.uuid.test(idBox))
            return [
                "The idBox format isn't valid",
            ];

        return [
            undefined,
            new RegisterCredentialDTO(name, password, description, code1, code2, idBox),
        ];
    }
}