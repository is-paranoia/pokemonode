// AuthStore.js
import { makeAutoObservable } from 'mobx';

class AuthStore {
  user = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.user = user;
    this.isAuthenticated = !!user;
  }

  login(user) {
    // Perform login logic...
    // Assume login is successful, set the user
    this.setUser(user);
  }

  logout() {
    // Perform logout logic...
    // Clear user data
    this.setUser(null);
  }
}

const authStore = new AuthStore();
export default authStore;
