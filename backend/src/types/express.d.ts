import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        organizationId: string;
        actualRole: {
          id?: string;
          key: string;
          permissions: string[];
          defaultLandingPage: string;
        };
        effectiveRole: {
          id?: string;
          key: string;
          permissions: string[];
          defaultLandingPage: string;
        };
        simulationMode: boolean;
        user: {
          _id: any;
          name: string;
          email: string;
          roleKey: string;
          organizationId: any;
        };
      };
    }
  }
}

export {};
