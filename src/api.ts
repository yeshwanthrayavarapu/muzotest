import { AuthDto, SignUpRequestDto, LoginResponseDto } from '../shared/dto';
import { User } from '../shared/user';
import { Session } from './contexts/AuthContext';

const ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
if (!ENDPOINT) throw new Error('BACKEND_ENDPOINT is not defined');


export class ApiError {
    public readonly message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}

export async function getRequest(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const response = await fetch(`${ENDPOINT}${url}`, {
        ...options,
        method: 'GET',
    });

    return response;
}

export async function authedRequest(
    url: string,
    session: Session,
    options: RequestInit = {}
): Promise<Response> {
    const headers = new Headers(options.headers);
    delete options.headers;
    headers.set('Authorization', `Bearer ${session.jwtToken}`);

    const response = await fetch(`${ENDPOINT}${url}`, {
        ...options,
        headers,
    });

    console.log('Response:', response);

    return response;
}

export async function authedPost(
    url: string,
    session: Session,
    object: object = {},
): Promise<Response> {
    return await authedRequest(url, session, {
        method: 'POST',
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}


export async function login(
    email: string,
    password: string
): Promise<{ session: Session, user: User } | ApiError> {
    const body: AuthDto = {
        username: email,
        password,
    };

    const response = await fetch(`${ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) return new ApiError('Invalid email or password');

    const responseBody = await response.json() as LoginResponseDto;

    const session = {
        jwtToken: responseBody.jwtToken,
    };

    return {
        session,
        user: responseBody.user,
    };
}

export async function signUp(
    request: SignUpRequestDto
) {
    const response = await fetch(`${ENDPOINT}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) return new ApiError('Email or username already in use.');

    const responseBody = await response.json() as LoginResponseDto;

    const session = {
        jwtToken: responseBody.jwtToken,
    };

    return {
        session,
        user: responseBody.user,
    };
}

export async function fetchProfile(userUuid: string): Promise<User> {
    const response = await getRequest(`/users/${userUuid}`);
    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }
    return await response.json();
}

