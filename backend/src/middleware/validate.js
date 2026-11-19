export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      }));
      return res.status(400).json({
        error: issues[0]?.message || 'Validation failed',
        details: issues,
      });
    }
    req.validatedBody = parsed.data;
    return next();
  };
}
