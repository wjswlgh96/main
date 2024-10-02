type ErrorType = {
  [key: string]: string;
};

export const errors: ErrorType = {
  "auth/invalid-login-credentials": "아이디 혹은 비밀번호가 틀렸습니다.",
  "auth/email-already-in-use": "이미 존재하는 이메일입니다.",
  "auth/weak-password": "비밀번호는 6자리 이상이어야 합니다.",
};
