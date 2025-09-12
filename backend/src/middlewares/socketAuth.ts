import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import { Socket } from "socket.io";
import cookie from "cookie";
interface SocketWithAuth extends Socket {
  user_id?: { id: string }; // หรือจะเป็น Type ของ user ที่คุณกำหนดเอง
}

export const socketAuthMiddleware = (
  socket: SocketWithAuth,
  next: (err?: Error) => void
) => {
  try {
    console.log('socketAuthMiddleware calling...');
    const cookieString = socket.handshake.headers.cookie;
    console
    if (!cookieString) {
      return next(ApiError.unauthorized("No token provided scoket"));
    }

    const parsedCookies = cookie.parse(cookieString);
    const token = parsedCookies.accessToken || socket.handshake.auth.token;

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      user_id: string;
    };
    if(decoded){
       console.log('decoded socket', decoded);
       socket.data.user_id = decoded.user_id;
    }
 
    next();
  } catch (err) {
    console.error("Socket Authentication Error:", err);
    return next(ApiError.unauthorized("Invalid Token"));
  }
};
