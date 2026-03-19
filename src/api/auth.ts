const OTP_TTL_MS = 2 * 60 * 1000;
const VALID_CODE = "123456";

type AuthCodePayload = {
  email: string;
};

type VerifyCodePayload = {
  email: string;
  code: string;
};

export type VerifyCodeSuccess = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
};

type OtpRecord = {
  code: string;
  expiresAt: number;
};

const otpMap = new Map<string, OtpRecord>();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function sendCode(payload: AuthCodePayload): Promise<{ ok: true }> {
  const email = normalizeEmail(payload.email);
  await wait(350);
  otpMap.set(email, { code: VALID_CODE, expiresAt: Date.now() + OTP_TTL_MS });
  return { ok: true };
}

export async function verifyCode(payload: VerifyCodePayload): Promise<VerifyCodeSuccess> {
  const email = normalizeEmail(payload.email);
  await wait(350);
  const record = otpMap.get(email);

  if (!record) {
    throw new Error("CODE_NOT_SENT");
  }

  if (Date.now() > record.expiresAt) {
    otpMap.delete(email);
    throw new Error("CODE_EXPIRED");
  }

  if (payload.code.trim() !== record.code) {
    throw new Error("INVALID_CODE");
  }

  otpMap.delete(email);
  return {
    accessToken: `stub-token-${email}-${Date.now()}`,
    user: {
      id: email,
      email,
      username: email.split("@")[0] || "user"
    }
  };
}
