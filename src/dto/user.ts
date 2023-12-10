import { IsString, IsEmail } from 'class-validator';
export class LoginUserDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class ResponceUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}

export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserDTO {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEmail()
  email?: string;

  @IsString()
  password?: string;
}
