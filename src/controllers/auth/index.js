import * as login from './login.js';
import * as logout from './logout.js';
import * as profile from './profile.js';

export const authController = {
  ...login,
  ...logout,
  ...profile
};