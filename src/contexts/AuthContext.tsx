
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
    console.log("Setting up auth state listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
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
        console.log("Checking for existing session");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session loading error:", error);
          return;
        }
        
        if (session?.user) {
          console.log("Found existing session:", session);
          setSession(session);
          await fetchUserProfile(session.user.id);
        }
      } catch (err) {
        console.error("Error loading user:", err);
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
      console.log("Fetching user profile for ID:", userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      console.log("User data response:", { data, error });
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user:", error);
        throw error;
      }
      
      if (data) {
        console.log("Setting user from database:", data);
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
          console.log("Creating new user in database from auth:", authUser);
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
            console.error("Error creating user:", insertError);
          } else {
            console.log("Created new user:", newUser);
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
      console.error("Error in fetchUserProfile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log("Sign in successful, user:", data.user);
      
      toast("Logged in successfully", {
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error("Login error:", error.message);
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
      console.log("Attempting sign up with:", { email, username, role, teacherCode });
      
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

      console.log("Sign up successful, user:", data.user);
      toast("Account created", {
        description: "Please check your email to confirm your account",
      });
    } catch (error: any) {
      console.error("Sign up error:", error.message);
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
      console.error("Sign out error:", error.message);
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
