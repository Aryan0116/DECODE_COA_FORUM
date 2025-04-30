import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/forum';
import { supabase, verifyTeacherCode } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, role: string, teacherCode?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // console.log("Setting up auth state listener");  // Logs when the auth state listener is being set up.

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // console.log("Auth state changed:", event, session);  // Logs the auth state change event and the new session.
        setSession(session);

        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    async function loadUser() {
      setIsLoading(true);
      try {
        // console.log("Checking for existing session");  // Logs before checking for an existing session.
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          // console.error("Session loading error:", error);  // Logs any error that occurs while loading the session.
          return;
        }

        if (session?.user) {
          // console.log("Found existing session:", session);  // Logs when an existing session is found.
          setSession(session);
          await fetchUserProfile(session.user.id);
        }
      } catch (err) {
        // console.error("Error loading user:", err);  // Logs any error that occurs during the user loading process.
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // console.log("Fetching user profile for ID:", userId);  // Logs the user ID for which the profile is being fetched.
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      // console.log("User data response:", { data, error });  // Logs the response from the user data fetch.

      if (error && error.code !== 'PGRST116') {
        // console.error("Error fetching user:", error);  // Logs errors other than 'PGRST116' (no data found).
        throw error;
      }

      if (data) {
        // console.log("Setting user from database:", data);  // Logs the user data being set from the database.
        setUser({
          id: data.id,
          email: data.email,
          username: data.name,
          role: data.user_type,
          created_at: data.created_at,
          avatar_url: data.avatar_url
        } as User);
      } else {
        // If user doesn't exist in the database yet, create them from auth metadata
        const authUser = session?.user;
        if (authUser) {
          // console.log("Creating new user in database from auth:", authUser);  // Logs when a new user is being created in the database.
          const userData = {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata.username || 'User',
            user_type: authUser.user_metadata.role || 'student'
          };

          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();

          if (insertError) {
            // console.error("Error creating user:", insertError);  // Logs errors during new user creation.
          } else {
            // console.log("Created new user:", newUser);  // Logs the data of the newly created user.
            setUser({
              id: newUser.id,
              email: newUser.email,
              username: newUser.name,
              role: newUser.user_type,
              created_at: newUser.created_at
            } as User);
          }
        }
      }
    } catch (error) {
      // console.error("Error in fetchUserProfile:", error);  // Logs errors within the fetchUserProfile function.
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // console.log("Attempting sign in with:", email);  // Logs the email used for sign in.
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // console.log("Sign in successful, user:", data.user);  // Logs the user data upon successful sign in.

      toast("Logged in successfully", {
        description: "Welcome back!",
      });
    } catch (error: any) {
      // console.error("Login error:", error.message);  // Logs the error message from a failed login.
      toast("Login failed", {
        description: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, username: string, role: string, teacherCode?: string) => {
    setIsLoading(true);
    try {
      // console.log("Attempting sign up with:", { email, username, role, teacherCode });  // Logs the data used for sign up.

      if (role === 'teacher') {
        const { isValid, error: verifyError } = await verifyTeacherCode(teacherCode || '');
        if (!isValid) {
          throw new Error('Invalid teacher code');
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role,
            teacher_code: teacherCode
          }
        }
      });

      if (error) throw error;

      // console.log("Sign up successful, user:", data.user);  // Logs the user data upon successful sign up.
      toast("Account created", {
        description: "Please check your email to confirm your account",
      });
    } catch (error: any) {
      // console.error("Sign up error:", error.message);  // Logs the error message from a failed sign up.
      toast("Sign up failed", {
        description: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      toast("Logged out", {
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      // console.error("Sign out error:", error.message);  // Logs the error message from a failed sign out.
      toast("Error", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (!error) {
        toast("Password updated", {
          description: "Your password has been updated successfully",
        });
      } else {
        toast("Password update failed", {
          description: error.message,
        });
      }

      return { error };
    } catch (error: any) {
      // console.error("Password update error:", error.message);
      toast("Error", {
        description: error.message,
      });
      return { error };
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user || !session) {
        throw new Error('No user is signed in');
      }

      // Delete user data from the database
      const { error: userDataError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (userDataError) {
        throw userDataError;
      }

      // Delete auth user
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (!error) {
        setUser(null);
        setSession(null);
        toast("Account deleted", {
          description: "Your account has been deleted",
        });
      } else {
        toast("Account deletion failed", {
          description: error.message,
        });
      }

      return { error };
    } catch (error: any) {
       // console.error("Account deletion error:", error.message);
      toast("Error", {
        description: error.message,
      });
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        updatePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
