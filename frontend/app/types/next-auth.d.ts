import { Session } from "next-auth";
import { User } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types from NextAuth to include the userType.
   */
  interface Session {
    userType?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  }

  interface User {
    userType?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  }
}
