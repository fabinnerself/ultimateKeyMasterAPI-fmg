import { regularExp } from "../../../config";

export class UpdatePinDTO {
    constructor(
        public pin: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdatePinDTO?] {
        const { pin } = object;

        if (!pin) return ["Missing pin"];
        if (!regularExp.pinVal.test(pin))
            return [
                "The PIN must be either 1 or 6 characters long",
            ];


        return [
            undefined,
            new UpdatePinDTO(pin),
        ];
    }
}