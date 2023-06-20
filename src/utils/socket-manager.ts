// module imports
// import admin from "firebase-admin";
import { Server } from "socket.io";

// file imports
import * as usersController from "../controllers/users.js";
// import serviceAccount from "../services/backend-boilerplate-official-firebase-adminsdk-o1ajl-593da86247.json" assert { type: "json" };

// variable initializations
// const connection = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
// });

class SocketManager {
  // constructor() {
  //   this.connection = connection;
  // }

  /**
   * @description Emit event
   * @param {String} to event listener
   * @param {String} event event title
   * @param {Object} data event data
   * @returns {Object} socket response
   */
  async emitEvent(params: any) {
    const { to, event, data } = params;
    // typescript-error
    // const response = await global.io.to(to).emit(event, data);
    // // response = await connection
    // // 	.firestore()
    // // 	.collection("socket")
    // // 	.doc(to)
    // // 	.set(
    // // 		JSON.parse(
    // // 			JSON.stringify({
    // // 				type: event,
    // // 				data,
    // // 			})
    // // 		)
    // // 	);
    // return response;
  }

  /**
   * @description Emit event
   * @param {String} event event title
   * @param {Object} data event data
   * @returns {Object} socket response
   */
  async emitGroupEvent(params: any) {
    const { event, data } = params;
    // typescript-error
    // const response = await global.io.emit(event, data);
    // return response;
  }

  /**
   * @description @param {Object} httpServer http server instance
   * @param {Object} app express app instance
   */
  async initializeSocket(params: any) {
    const { server, app } = params;
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    // typescript-error
    // global.io = io;
    io.on("connection", (socket) => {
      socket.on("join", async (data) => {
        socket.join(data);
        console.log(`${data} joined`);
        try {
          const args = { user: data, isOnline: true };
          await usersController.updateUser(args);
        } catch (error) {
          console.log(error);
        }
      });
      socket.on("leave", async (data) => {
        // typescript-error
        // socket.leave();
        console.log(`${data} left`);
        try {
          const args = { user: data, isOnline: false };
          await usersController.updateUser(args);
        } catch (error) {
          console.log(error);
        }
      });
      socket.on("disconnect", (reason) => {
        console.log("user disconnected " + reason);
      });
    });

    // attach to app instance
    app.use((req: any, res: any, next: any) => {
      req.io = io;
      next();
    });
  }
}

export default SocketManager;
