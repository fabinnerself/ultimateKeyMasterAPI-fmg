import { regularExp } from "../../../config";

export class UpdateBoxDTO {
    constructor(
        public name: string,
        public favorite: boolean,
        public icon: string 
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateBoxDTO?] {
        const { name, favorite, icon } = object;

        if (!name) return ["Missing box name"];
        if (!regularExp.nameBox.test(name))
            return [
                "The Security Box name must be between 1 an 100 characters long",
            ];

        if (!regularExp.iconBox.test(icon))
            return [
                "The icon must be between 1 an 20 characters long",
            ];

        if (typeof favorite !== 'boolean')
            return [
                "The Favorite field must be a boolean value (true or false)",
            ];

   

        return [
            undefined,
            new UpdateBoxDTO(name, favorite, icon),
        ];
    }
}