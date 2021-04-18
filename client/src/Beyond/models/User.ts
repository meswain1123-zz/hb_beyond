
import { ModelBase } from "./ModelBase";
// import { PlayToken } from "./PlayToken";
// import { Mask } from "./Mask";
// import { Campaign } from "./Campaign";

export class User extends ModelBase {
  email: string;
  username: string;
  password: string;
  dm: boolean;

  constructor(obj?: any) {
    super(obj);
    this.data_type = "user";
    this.email = obj ? `${obj.email}` : "";
    this.username = obj ? `${obj.username}` : "";
    this.password = obj ? `${obj.password}` : "";
    this.dm = obj ? obj.dm : false;
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      email: this.email,
      username: this.username,
      password: this.password,
      dm: this.dm
    };
  }

  clone(): User {
    return new User(this);
  }

  copy(copyMe: User): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.email = copyMe.email;
    this.username = copyMe.username;
    this.password = copyMe.password;
    this.dm = copyMe.dm;
  }
}