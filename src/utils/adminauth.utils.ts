import { jwtDecode } from "jwt-decode";
import { ICommonAuthUtility } from "../interfaces/common.interface";

class AdminAuth {
  decodedToken: ICommonAuthUtility | null = null;
  token: string | null = null;
  constructor() {
    try {
      this.token = localStorage.getItem("adminToken");
      if (this.token) {
        this.decodedToken = jwtDecode<ICommonAuthUtility>(this.token);
      }
    } catch (error) {
      console.error("Error decoding the token:", error);
    }
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    if (this.decodedToken) {
      const currentTime = Math.floor(Date.now() / 1000);
      return this.decodedToken.exp > currentTime;
    }
    return false;
  }
}

export default AdminAuth;
