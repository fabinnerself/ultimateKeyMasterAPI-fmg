import { regularExp } from "../../../config";

export class ListBoxDTO {
    constructor(
        public id: string,
        public order: "Alfabetic" | "Date" | "Registers",
        public favorites: 'All' | 'Favorites'
    ) { }

    static create(object: { [key: string]: any }): [string?, ListBoxDTO?] {
        const { id, order, favorites } = object;

        if (!id) return ["Missing Security Box User"];
        if (!regularExp.uuid.test(id))
            return [
                "The Security Box user Id format is not valid",
            ];

        if (!order) return ["Missing Security Box order"];

        if (order! == "Alfabetic" && order! == "Date" && order! == "Registers")
            return [
                "The security box order must be Alfabetic, date, or Registers",
            ];

        if (!favorites) return ["Missing Security Box filter"];

        if (favorites !== 'All' && favorites !== 'Favorites')
            return [
                "The Favorite filter  must be All or Favorites",
            ];

        return [
            undefined,
            new ListBoxDTO(id, order, favorites),
        ];
    }
}