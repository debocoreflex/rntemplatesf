// src/services/AuthService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_TOKEN_KEY = 'user_token';
const USER_INFO_KEY = 'user_info';

const AuthService = {
  async login(username: string, password: string): Promise<boolean> {
    // TODO: Call your real login API here
    // For example, simulate a login:
    if (username === 'demo' && password === 'demo') {
      const fakeToken = 'abc123token';
      const userInfo = { username, name: 'Demo User' };
      await AsyncStorage.setItem(USER_TOKEN_KEY, fakeToken);
      await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
      return true;
    }
    return false;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(USER_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_INFO_KEY);
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(USER_TOKEN_KEY);
  },

  async getUser(): Promise<{ username: string; name: string } | null> {
    const userStr = await AsyncStorage.getItem(USER_INFO_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },
};

export default AuthService;
