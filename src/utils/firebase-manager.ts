// module imports
// import admin from "firebase-admin";

// file imports
import serviceAccount from "../services/backend-boilerplate-official-firebase-adminsdk-o1ajl-593da86247.json" assert { type: "json" };

// variable initializations
// const connection = admin.initializeApp({
//   // typescript-error
//   // credential: admin.credential.cert(serviceAccount),
// });

class FirebaseManager {
  // connection: admin.app.App;
  constructor() {
    // this.connection = connection;
  }

  /**
   * @description Send firebase notification
   * @param {[String]} fcms firebase cloud messaging user tokens array
   * @param {String} title notification title
   * @param {String} body notification body
   * @param {Object} data notification data
   */
  async notify(params: any) {
    // const { title, body } = params;
    // let { data, fcms, fcm } = params;
    // data = data ?? {};
    // fcms = fcms?.length > 0 ? fcms : fcm ? [fcm] : ["null"];
    // const payload = {
    //   notification: {
    //     title,
    //     body,
    //     sound: "default",
    //   },
    //   data,
    // };
    // connection
    //   .messaging()
    //   .sendToDevice(fcms, payload)
    //   .then((response) => {
    //     console.log("response", response);
    //     console.log("response.results", response.results);
    //   })
    //   .catch((error) => console.error(error));
  }
}

export default FirebaseManager;
