import { validateCsrfToken } from "./csrf";

export function validateAuthRequest(
  request: Request,
  body: { website?: string },
): { ok: true } | { ok: false; status: number; error: string } {
  const csrf = request.headers.get("x-csrf-token");
  if (!validateCsrfToken(csrf)) {
    return { ok: false, status: 403, error: "Invalid or missing security token" };
  }

  if (body.website) {
    return { ok: false, status: 400, error: "Request rejected" };
  }

  return { ok: true };
}

export function sanitizePublicSession(session: {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    phoneNumber?: string | null;
    phoneNumberVerified?: boolean;
  };
  expiresAt: string;
}) {
  return {
    user: session.user,
    expiresAt: session.expiresAt,
  };
}
