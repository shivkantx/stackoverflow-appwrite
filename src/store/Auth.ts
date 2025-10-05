import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config"; // your Appwrite client config

// Define custom user preferences that will be stored in Appwrite.
// Here, we're tracking a "reputation" score for each user.
export interface UserPrefs {
  reputation: number;
}

// 🔸 Zustand store shape (state + actions)
interface IAuthStore {
  // ------------------ STATE ------------------
  session: Models.Session | null; // holds the current Appwrite session (if logged in)
  jwt: string | null; // Appwrite JWT token for server-side authenticated requests
  user: Models.User<UserPrefs> | null; // full user object with custom prefs (like reputation)
  hydrated: boolean; // flag that tells us whether Zustand has loaded persisted state

  // ------------------ ACTIONS ------------------
  setHydrated: () => void; // mark the store as hydrated after rehydration
  verifySession: () => Promise<void>; // check if the session is still valid & refresh user/jwt
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout: () => Promise<void>; // clear session + state
}

// ✅ Create the Zustand store with middleware
export const useAuthStore = create<IAuthStore>()(
  persist(
    // persist to localStorage
    immer((set) => ({
      // immer lets us mutate state directly (draft mode)
      // ------------------ INITIAL STATE ------------------
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      // Mark store as hydrated after rehydration
      setHydrated() {
        set({ hydrated: true });
      },

      // 🔸 Verify if there's an active session and update state accordingly
      async verifySession() {
        try {
          // 1. Try to get the current session from Appwrite
          const session = await account.getSession("current");

          // 2. In parallel, get the user object and a fresh JWT
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          // 3. Update Zustand store with latest session data
          set({ session, user, jwt });
        } catch (error) {
          console.log("❌ verifySession failed:", error);
          // If the session is invalid, clear state
          set({ session: null, user: null, jwt: null });
        }
      },

      // 🔸 Login flow
      async login(email, password) {
        try {
          // 1. Create an Appwrite session with email & password
          const session = await account.createEmailPasswordSession(
            email,
            password
          );

          // 2. Fetch user info and JWT simultaneously
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          // 3. If this is a new user, initialize their reputation
          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({ reputation: 0 });
          }

          // 4. Update Zustand state with session, user, and JWT
          set({ session, user, jwt });

          return { success: true };
        } catch (error) {
          console.log("❌ login error:", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      // 🔸 Signup flow
      async createAccount(name, email, password) {
        try {
          // Create a new Appwrite user account
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log("❌ createAccount error:", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      // 🔸 Logout flow
      async logout() {
        try {
          // Delete all Appwrite sessions for the user
          await account.deleteSessions();

          // Reset Zustand state
          set({ session: null, jwt: null, user: null });
        } catch (error) {
          console.log("❌ logout error:", error);
        }
      },
    })),
    {
      // Unique name for localStorage key
      name: "auth",

      // Hook that runs when store is rehydrated from storage (e.g., on page reload)
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) {
            // Mark hydrated so UI can rely on persisted data
            state?.setHydrated();
          } else {
            console.log("❌ Error rehydrating auth store:", error);
          }
        };
      },
    }
  )
);
