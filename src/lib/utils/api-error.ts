interface ZodIssue {
  message: string;
}

export function formatApiError(error: unknown): string {
  if (typeof error === "string") return error;

  if (Array.isArray(error)) {
    return error
      .map((issue) =>
        typeof issue === "object" && issue !== null && "message" in issue
          ? String((issue as ZodIssue).message)
          : "Validation error",
      )
      .join(", ");
  }

  return "Request failed";
}
