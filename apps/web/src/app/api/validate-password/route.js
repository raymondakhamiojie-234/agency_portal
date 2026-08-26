// Password validation endpoint for additional security
export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return Response.json(
        { error: "Password is required", valid: false },
        { status: 400 },
      );
    }

    // Validate password requirements
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(password),
    };

    const isValid = Object.values(validation).every(Boolean);

    if (!isValid) {
      const missingRequirements = [];
      if (!validation.length) missingRequirements.push("at least 8 characters");
      if (!validation.uppercase)
        missingRequirements.push("an uppercase letter");
      if (!validation.lowercase) missingRequirements.push("a lowercase letter");
      if (!validation.number) missingRequirements.push("a number");
      if (!validation.special) missingRequirements.push("a special character");

      return Response.json(
        {
          error: `Password must contain ${missingRequirements.join(", ")}`,
          valid: false,
          validation,
        },
        { status: 400 },
      );
    }

    return Response.json({ valid: true, validation });
  } catch (error) {
    console.error("Password validation error:", error);
    return Response.json(
      { error: "Failed to validate password", valid: false },
      { status: 500 },
    );
  }
}
