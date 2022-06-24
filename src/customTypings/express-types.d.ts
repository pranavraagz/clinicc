declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: "staff" | "admin" | "superadmin";
    };
  }
}
