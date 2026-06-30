import users from '../mock/users.json';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
  };
  token: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800);

    const user = users.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = `mock-token-${user.id}-${Date.now()}`;

    if (credentials.rememberMe) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('token', token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar,
      },
      token,
    };
  },

  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
  },

  async verifyToken(token: string): Promise<boolean> {
    await delay(300);
    return token.startsWith('mock-token-');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },
};
