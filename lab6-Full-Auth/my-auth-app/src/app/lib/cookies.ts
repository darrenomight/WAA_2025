import { serialize } from "cookie";

const isProd = process.env.NODE_ENV === "production";
export function cookie(name: string, value: string, maxAge: number) {
  return serialize(name, value, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function deleteCookie(name: string) {
    return `${name}=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
};


export const accessCookie = (token: string) => cookie("access_token", token, 60 * 15);

export const refreshCookie = (token: string) => cookie("refresh_token", token, 60 * 60 * 24 * 7);
  
export const clearCookies = () => [
  serialize("access_token", "", { maxAge: 0, path: "/", httpOnly: true }),
  serialize("refresh_token", "", { maxAge: 0, path: "/", httpOnly: true }),
];
