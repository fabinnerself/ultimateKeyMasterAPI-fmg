import { encriptAdapter, envs } from "../../config";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserStatus , User } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDTO  } from "../../domain";
import { EmailService } from "./email.service";
import { protectAccountOwner } from "../../config/validate-owner";

export class UserService {
  constructor(private readonly emailService: EmailService) {}

  async login(credentials: LoginUserDto) {
    
    const user = await this.findUserByEmail(credentials.email);
    
    const isMatching = encriptAdapter.compare(
      credentials.password,
      user.password
    );
    if (!isMatching) throw CustomError.unAuthorized("Invalid Credentials");
    
    const token = await JwtAdapter.generateToken({ id: user.id }); 
    if (!token) throw CustomError.internalServer("Error while creating JWT");
    
    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,        
        email: user.email,       
      },
    };
  }

  async register(userData: RegisterUserDTO) {
    
    const user = new User();

    user.name = userData.name;    
    user.surname = userData.surname; 
    user.email = userData.email;
    user.password = userData.password;        
    user.cellphone = userData.cellphone;  

    try {
      const dbUser = await user.save();

      await this.sendEmailValidationLink(dbUser.email);

      return {
        id: dbUser.id,
        name: dbUser.name,    
        surname: dbUser.surname,     
        email: dbUser.email,        
        cellphone: dbUser.cellphone, 
      };
    } catch (error: any) {
      if (error.code === "23505") {
        throw CustomError.badRequest(
          `User with email: ${userData.email} already exist`
        );
      }
      throw CustomError.internalServer("Error while creating user");
    }
  }

  async findUserByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
        status: UserStatus.ACTIVE,
      },
    });

    if (!user) throw CustomError.notFoud(`User with email: ${email} not found`);

    return user;
  }

  public sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email }, "300s");
    if (!token) throw CustomError.internalServer("Error getting token");

    const link = `http://${envs.WEBSERVICE_URL}/api/user/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;
    const isSent = this.emailService.sendEmail({
      to: email,
      subject: "Validate your account",
      htmlBody: html,
    });
    if (!isSent) throw CustomError.internalServer("Error sending email");

    return true;
  };

  validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest("Invalid Token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not in token");

    const user = await User.findOne({ where: { email: email } });
    if (!user) throw CustomError.internalServer("Email not exist");

    user.status = UserStatus.ACTIVE;

    try {
      await user.save();

      return {
        message: "Usuario activado",
      };
    } catch (error) {
      throw CustomError.internalServer("Something went very wrong");
    }
  };

  async getUserProfile(user: User) {
    return {
      id: user.id,
      name: user.name,   
      surname:user.surname,   
      email: user.email,
      cellphone:user.cellphone      
    };
  }

  async findOneUser(userId: string) {
    const result = await User.createQueryBuilder("user")
      .where("user.id = :id", { id: userId })
      .andWhere("user.status = :userStatus", { userStatus: UserStatus.ACTIVE })
      .getOne();

    if (!result) {
      throw CustomError.notFoud("User not found");
    }
 
    return result;
  } 
 


}
