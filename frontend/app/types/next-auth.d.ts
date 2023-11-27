import { Session } from "next-auth";
import { User } from "next-auth";


declare module "next-auth" {
  /**
   * Extends the built-in session types from NextAuth to include the userType.
   */
  interface Session {
    userType?: string;
  }

  interface User {
    userType?: string;
  }
}
