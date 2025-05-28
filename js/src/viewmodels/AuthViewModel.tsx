import { makeAutoObservable, runInAction } from 'mobx';
import AuthService from '../services/AuthServices';


class AuthViewModel {
  isLoggedIn = false;
  isCheckingAuth = true;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Called on app start to verify if user is logged in
  async checkAuth() {
    this.isCheckingAuth = true;
    try {
      const loggedIn = await AuthService.isLoggedIn();
      runInAction(() => {
        this.isLoggedIn = loggedIn;
        this.error = null;
      });
    } catch (e) {
      runInAction(() => {
        this.error = 'Failed to check authentication';
        this.isLoggedIn = false;
      });
    } finally {
      runInAction(() => {
        this.isCheckingAuth = false;
      });
    }
  }

  // Login method
  async login(username: string, password: string) {
    this.error = null;
    try {
      const success = await AuthService.login(username, password);
      runInAction(() => {
        this.isLoggedIn = success;
        if (!success) this.error = 'Invalid username or password';
      });
      return success;
    } catch (e) {
      runInAction(() => {
        this.error = 'Login failed due to network error';
      });
      return false;
    }
  }

  // Logout method
  async logout() {
    await AuthService.logout();
    runInAction(() => {
      this.isLoggedIn = false;
      this.error = null;
    });
  }
}

export default new AuthViewModel();
