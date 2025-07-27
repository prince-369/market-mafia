// src/services/auth.js
import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export const AuthService = {
  // User Registration
  async register({ email, password, fullName, phoneNumber }) {
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

      // 3. Create session (auto-login after registration)
      await this.login({ email, password });
      
      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // User Login
  async login({ email, password }) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Get Current User
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Logout
  async logout() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Password Reset
  async forgotPassword(email) {
    try {
      return await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Password Update
  async updatePassword(userId, secret, newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords don't match");
    }
    
    try {
      return await account.updateRecovery(
        userId,
        secret,
        newPassword,
        confirmPassword
      );
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Error Handling
  handleError(error) {
    console.error('Auth Error:', error);
    
    // Custom error messages
    switch (error.type) {
      case 'user_already_exists':
        return new Error('Email already registered');
      case 'user_invalid_credentials':
        return new Error('Invalid email or password');
      case 'general_argument_invalid':
        return new Error('Invalid request parameters');
      default:
        return new Error(error.message || 'Authentication failed');
    }
  }
};