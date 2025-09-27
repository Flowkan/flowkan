import { Request, Response, NextFunction } from "express";

export const validateTurnstile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { turnstileResponse } = req.body;

    if (!turnstileResponse) {
      return res.status(400).json({
        success: false,
        message: "Token de Turnstile no enviado.",
      });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "TURNSTILE_SECRET_KEY no está configurada en el backend.",
      );
    }

    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", turnstileResponse);
    if (req.ip) {
      params.append("remoteip", req.ip);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      },
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: "Validación fallida en Turnstile. Intenta otra vez.",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};
