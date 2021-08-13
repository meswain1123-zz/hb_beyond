
import { ModelBase } from "./ModelBase";

export class User extends ModelBase {
  static data_type: string = "user";
  email: string;
  username: string;
  password: string;
  dm: boolean;
  admin: boolean;

  constructor(obj?: any) {
    super(obj);
    this.email = obj ? obj.email : "";
    this.username = obj ? obj.username : "";
    this.password = obj ? obj.password : "";
    this.dm = obj ? obj.dm : false;
    this.admin = obj ? obj.admin : false;
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      email: this.email,
      username: this.username,
      password: this.password,
      dm: this.dm,
      admin: this.admin
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
    this.admin = copyMe.admin;
  }
}