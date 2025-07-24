import { createContext, useContext, useEffect, useState } from 'react';
import { Client, Account, Databases, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check current user session on initial load
  const checkCurrentUser = async () => {
    setLoading(true);
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      // Expected error when no session exists
      if (err.code !== 401) {
        console.error('Failed to check user session:', err);
        setError('Failed to check authentication status');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkCurrentUser();
  }, []);

  // Register new user
  const register = async ({ email, password, fullName, phoneNumber }) => {
    setLoading(true);
    try {
      // 1. Create user account
      const user = await account.create(
        ID.unique(),
        email,
        password,
        fullName
      );

      // 2. Create user document in database
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          fullName,
          email,
          phoneNumber,
          userId: user.$id
        }
      );

      // 3. Create session automatically
      return await login({ email, password });
    } catch (err) {
      const errorMsg = handleAuthError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      await account.createEmailSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      setError(null);
      return currentUser;
    } catch (err) {
      const errorMsg = handleAuthError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    try {
      await account.deleteSession('current');
      setUser(null);
      setError(null);
    } catch (err) {
      const errorMsg = handleAuthError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Password recovery
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      setError(null);
    } catch (err) {
      const errorMsg = handleAuthError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle authentication errors
  const handleAuthError = (error) => {
    console.error('Auth Error:', error);
    
    // Appwrite-specific error codes
    if (error.code === 401) {
      return 'Session expired. Please login again.';
    }
    if (error.code === 409) {
      return 'User already exists with this email';
    }
    if (error.code === 429) {
      return 'Too many requests. Please try again later.';
    }

    // Type-based errors
    switch (error.type) {
      case 'user_already_exists':
        return 'Email already registered';
      case 'user_invalid_credentials':
        return 'Invalid email or password';
      case 'general_argument_invalid':
        return 'Invalid request parameters';
      default:
        return error.message || 'Authentication failed';
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    forgotPassword,
    checkCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
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