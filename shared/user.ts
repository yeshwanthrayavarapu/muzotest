export type UserUuid = string;

export interface User {
    uuid: UserUuid;
    username: string;
    email: string;
    details?: UserDetails;
    sensitive?: SensitiveDetails;
}

export type UserPublicInfo = Omit<User, 'sensitive'>;

export interface UserDetails {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    profileImage: string;
}

export interface SensitiveDetails {
    passwordHash: string;
}
