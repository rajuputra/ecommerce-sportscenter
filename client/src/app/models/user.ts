export interface Credentials {
  username: string;
  password: string;
}

export interface Registration extends Credentials {
  email: string;
}

export interface Profile {
  username: string;
  admin: boolean;
}

export interface User extends Profile {
  token: string;
}
