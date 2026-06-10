import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import type { AuthSession, AuthUser, LoginInput, RegisterInput } from "./types";

const COOKIE_NAME = "demo-auth-token";
const SESSION_DAYS = 7;

interface StoredUser extends AuthUser {
  passwordHash: string;
}

interface DemoAuthStore {
  users: StoredUser[];
  sessions: Map<string, { userId: string; expiresAt: Date }>;
}

declare global {
  // eslint-disable-next-line no-var
  var demoAuthStore: DemoAuthStore | undefined;
}

function getServerStore(): DemoAuthStore {
  if (!global.demoAuthStore) {
    global.demoAuthStore = { users: [], sessions: new Map() };
    seedAdminUser(global.demoAuthStore);
  }
  return global.demoAuthStore;
}

async function seedAdminUser(store: DemoAuthStore): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const exists = store.users.some((u) => u.email === email);
  if (exists) return;

  const hash = await bcrypt.hash(password, 10);
  store.users.push({
    id: uuidv4(),
    email,
    name: "Admin",
    passwordHash: hash,
    createdAt: new Date().toISOString(),
  });
}

function toPublicUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export const demoAuth = {
  cookieName: COOKIE_NAME,

  async register(input: RegisterInput): Promise<AuthSession> {
    const store = getServerStore();
    const email = input.email.toLowerCase().trim();

    if (store.users.some((u) => u.email === email)) {
      throw new Error("Email already registered");
    }

    const hash = await bcrypt.hash(input.password, 10);
    const user: StoredUser = {
      id: uuidv4(),
      email,
      name: input.name.trim(),
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    };

    store.users.push(user);
    return this.createSession(user);
  },

  async login(input: LoginInput): Promise<AuthSession> {
    const store = getServerStore();
    const email = input.email.toLowerCase().trim();
    const user = store.users.find((u) => u.email === email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid email or password");
    }

    return this.createSession(user);
  },

  createSession(user: StoredUser): AuthSession {
    const store = getServerStore();
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

    store.sessions.set(token, { userId: user.id, expiresAt });

    return {
      user: toPublicUser(user),
      token,
      expiresAt: expiresAt.toISOString(),
    };
  },

  getSession(token: string): AuthSession | null {
    const store = getServerStore();
    const session = store.sessions.get(token);
    if (!session) return null;

    if (session.expiresAt < new Date()) {
      store.sessions.delete(token);
      return null;
    }

    const user = store.users.find((u) => u.id === session.userId);
    if (!user) return null;

    return {
      user: toPublicUser(user),
      token,
      expiresAt: session.expiresAt.toISOString(),
    };
  },

  logout(token: string): void {
    getServerStore().sessions.delete(token);
  },

  getAllUsers(): AuthUser[] {
    return getServerStore().users.map(toPublicUser);
  },
};
