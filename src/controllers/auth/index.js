import { login, getMe, logout, status } from './login.js';

export { login, getMe, logout, status };

export const authController = {
  login,
  getMe,
  logout,
  status
};