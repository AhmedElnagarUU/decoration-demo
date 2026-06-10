import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

function createAuth() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/revylo";
  const client = new MongoClient(uri);
  const db = client.db();

  return betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  });
}

export const auth = createAuth();

export type Session = typeof auth.$Infer.Session;
