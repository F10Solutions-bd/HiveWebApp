export const validateWithZod = <T>(
  schema: any,
  data: T
): { success: boolean; errors: Record<string, string> } => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};

    result.error.issues.forEach((e: any) => {
      const field = e.path[0] as string;
      if (field) {
        errors[field] = e.message;
      }
    });

    return { success: false, errors };
  }

  return { success: true, errors: {} };
};