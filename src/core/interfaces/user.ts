
export interface UserAttributes {
    id: number;
    fullName: string;
    email: string;
    phone: number;
    balance: number;
    image?: string;
    isVerified: boolean;
    isAdmin: boolean;
    password: string;
}

export interface UserRegReq {
    fullName: string;
    email: string;
    phone: number;
    image?: string;
    password: string;
}

export interface UserReqRes {
    message: string;
    user: any;
}

export interface UserLoginReq {
    email: string;
    password: string;
}

export interface UserLoginRes {
    message: string;
    user: Partial<UserAttributes>;
}

export interface updateUserProfile {
    fullName?: string;
    phone?: number;
}

export interface GetUserProfileData {
    id: number;
}

export interface UserProfileData extends Partial<UserAttributes> { }

export interface jwtPayload {
    userId: number;
    email: string;
    name: string;
}

export interface LogOutUserRes {
    token: string;
}

export interface UploadedImage {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  }
  
  export interface ImageUploadRequest {
    file?: UploadedImage;
  }