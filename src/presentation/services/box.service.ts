import { Box, BoxStatus } from "../../data";
import { UserService } from "../services/user.service";
import { CustomError, RegisterBoxDTO, UpdateBoxDTO , ListBoxDTO } from "../../domain";

export class BoxService {
  constructor(private readonly userService: UserService) { }

  async findAllBoxServ(listOptions: ListBoxDTO) {

    try {

      const boxes = await Box.find({
        where: {
          box_status: BoxStatus.ACTIVE,
          user: { id: listOptions.id },
          ...((listOptions.favorites === 'Favorites')  ? { box_favorite: true } : {}) 
        },
        order: {
          // box_name: 'ASC'  
          ...(() => {
            switch (listOptions.order) {
              case 'Alfabetic':
                return { box_name: 'ASC' };
              case 'Date':
                return { box_date_created: 'DESC' };
              case 'Registers':
                return { box_id: true };
              default:
                return {};
            }
          })()
        }
      });

      return  boxes;
    } catch (error: any) {
      throw CustomError.internalServer("Error geting data from Security Box records ");
    }
  }

  async findOneBoxServ(id: string) {

    const box_found = await Box.findOne({
      where: {
        id,
        box_status: BoxStatus.ACTIVE
      },
    });

    if (!box_found) {

      throw CustomError.notFoud("An active Box is not found");
    }

    return box_found;
  }

  async deleteBoxServ(id: string) {

    const box_found = await this.findOneBoxServ(id);

    box_found.box_status = BoxStatus.DELETED;

    try {
      await box_found.save();
      return { message: "Security Box record deleted successfully " };
    } catch (error) {
      throw CustomError.internalServer("Error deleting Security Box ");
    }
  }

  async createBoxServ(boxData: RegisterBoxDTO) {

    const user_found = await this.userService.findOneUser(boxData.idUser);

    // console.log("user ", user_found)

    const box = new Box()

    box.box_name = boxData.name;
    box.box_favorite = boxData.favorite;
    box.box_icon = boxData.icon;
    box.user = user_found;

    try {
      const boxDB = await box.save();

      return {
        id: boxDB.id,
        name: boxDB.box_name,
        favorite: boxDB.box_favorite,
        icon: boxDB.box_icon,
        status: boxDB.box_status,
        user: {
          name: user_found.name,
          email: user_found.email,
        }

      };

    } catch (error: any) {

      throw CustomError.internalServer("Error creating a security box record ");
    }
  }

  async updateBoxServ(id: string, updateData:UpdateBoxDTO) {
    const box_found = await this.findOneBoxServ(id);

    box_found.box_name = updateData.name;
    box_found.box_icon = updateData.icon;
    box_found.box_favorite = updateData.favorite;

    try {
      return await box_found.save();
    } catch (error: any) {

      throw CustomError.internalServer("Error updating a Security box record ");
    }
  }

  
}