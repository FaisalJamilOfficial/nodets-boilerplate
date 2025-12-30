// module imports
// import admin from "firebase-admin";

// file imports
import ServiceAccount from "../services/backend-boilerplate-official-firebase-adminsdk-o1ajl-593da86247.json";

// variable initializations
const serviceAccount: any = ServiceAccount; /* as admin.ServiceAccount */
// const connection = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

class FirebaseManager {
  // connection: admin.app.App;
  constructor() {
    // this.connection = connection;
  }

  /**
   * Send multicast firebase notification
   * @param {[string]} tokens firebase cloud messaging user tokens
   * @param {string} title notification title
   * @param {string} body notification body
   * @param {object} data notification data
   * @param {string} imageUrl notification image url
   * @returns {null}
   */
  async multicast(parameters: {
    title: string;
    body: string;
    tokens: string[];
    data?: any;
    imageUrl?: string;
  }): Promise<void> {
    const { title, body, imageUrl } = parameters;
    let { tokens, data } = parameters;
    tokens = tokens?.length > 0 ? tokens : ["null"];
    const stringifiedData = JSON.stringify(data || {}, null, 2);
    const jsonData = { title, body };
    data = data ? { stringifiedData, title, body } : jsonData;
    const message /* : admin.messaging.MulticastMessage */ = {
      tokens,
      notification: { title, body },
      data,
      android: {
        priority: "high",
        notification: {
          imageUrl: imageUrl ?? "https://nodejs.org/static/images/logo.svg",
        },
      },
      apns: {
        headers: {
          "apns-priority": "10",
        },
        payload: {
          aps: {
            mutableContent: true,
            sound: "default",
          },
        },
        fcmOptions: {
          imageUrl: imageUrl ?? "https://nodejs.org/static/images/logo.svg",
        },
      },
      webpush: {
        notification: { tag: data?.type || "general" },
        headers: {
          Urgency: "high",
          image: imageUrl ?? "https://nodejs.org/static/images/logo.svg",
        },
      },
    };
    // connection
    //   .messaging()
    //   .sendEachForMulticast(message)
    //   .then((response: any) => {
    //     console.log("response", response);
    //     console.log("response.responses", response.responses);
    //   })
    //   .catch((error: any) => console.error(error));
  }
}

export default FirebaseManager;
