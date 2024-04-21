export class CreateUserDTO {
  email: string;

  userName: string;

  password: string;

  phoneNumber: string;

  avatar: string;

  background: string;
}

export interface ICreateUser {
  email: string;

  userName: string;

  password: string;

  phoneNumber: string;
}
