// module imports
// import admin from "firebase-admin";
import { Server } from "socket.io";
import { Response, NextFunction } from "express";

// file imports
import * as userController from "../modules/user/controller";
import { IRequest } from "../configs/types";
import serviceAccount from "../services/backend-boilerplate-official-firebase-adminsdk-o1ajl-593da86247.json";

// variable initializations
// const connection = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
// });

let socketIO: any;
class SocketManager {
  constructor() {
    // this.connection = connection;
  }

  /**
   * @description Emit event
   * @param {String} to event listener
   * @param {String} event event title
   * @param {Object} data event data
   * @returns {Object} socket response
   */
  async emitEvent(params: any) {
    const { data } = params;
    let { to, event } = params;
    to = to.toString();
    event = event.toString();
    return await socketIO.to(to).emit(event, data);
    // return await connection
    //   .firestore()
    //   .collection("socket")
    //   .doc(to)
    //   .set(
    //     JSON.parse(
    //       JSON.stringify({
    //         type: event,
    //         data,
    //       })
    //     )
    //   );
  }

  /**
   * @description Emit event
   * @param {String} event event title
   * @param {Object} data event data
   * @returns {Object} socket response
   */
  async emitGroupEvent(params: any) {
    const { event, data } = params;
    return await socketIO.emit(event.toString(), data);
  }

  /**
   * @description @param {Object} httpServer http server instance
   * @param {Object} app express app instance
   */
  async initializeSocket(params: any): Promise<void> {
    const { server, app } = params;
    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:3000", "https://admin.app.com"],
      },
    });
    socketIO = io;
    io.on("connection", (socket: any) => {
      socket.on("join", async (data: any) => {
        socket.join(data);
        console.log(`${data} joined`);
        try {
          const args = { isOnline: true };
          await userController.updateElementById(data, args);
        } catch (error) {
          console.log(error);
        }
      });
      socket.on("leave", async (data: any) => {
        socket.leave();
        console.log(`${data} left`);
        try {
          const args = { user: data, isOnline: false };
          await userController.updateElementById(data, args);
        } catch (error) {
          console.log(error);
        }
      });
      socket.on("disconnect", (reason: any) => {
        console.log("user disconnected " + reason);
      });
    });

    // attach to app instance
    app.use((req: IRequest, res: Response, next: NextFunction) => {
      req.io = io;
      next();
    });
  }
}

export default SocketManager;
