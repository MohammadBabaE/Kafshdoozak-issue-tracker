export function validEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validPasswordLength(password: string): boolean {
  const re = /^.{12,25}$/;
  return re.test(password);
}

export function validPasswordSpecialChar(password: string): boolean {
  const re = /(?=.*[!@#$%^&*(),.?":{}|<>])/;
  return re.test(password);
}

export function validPasswordNumber(password: string): boolean {
  const re = /(?=.*\d)/;
  return re.test(password);
}

export function validUsernameCharacters(username: string): boolean {
  const re = /^[\u0600-\u06FFa-zA-Z0-9\s]+$/;
  return re.test(username);
}