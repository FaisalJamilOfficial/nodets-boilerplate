// module imports
// import twilio from "twilio";
// import otpGenerator from "otp-generator";

// file imports
import * as usersController from "../controllers/users";
import { getToken } from "../middlewares/authenticator";

// destructuring assignments
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

// variable initializations
// const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

class TwilioManager {
  client: any;
  constructor() {
    // this.client = client;
  }

  /**
   * @description Send OTP to phone number
   * @param {String} user user id
   * @param {String} phone user phone number in INTERNATIONAL format
   * @returns {Object} token
   */
  async sendOTP(params: any): Promise<any> {
    const { user, phone } = params;

    if (!phone) throw new Error("Please enter phone number!|||400");

    const userExists = await usersController.getUser({ phone });

    const otp = "111111";
    // otpGenerator.generate(6, {
    //   specialChars: false,
    //   lowerCaseAlphabets: false,
    //   upperCaseAlphabets: false,
    // });
    console.log("OTP -->", otp);
    try {
      // await client.messages.create({
      //   body: "Backend Boilerplate verification code is: " + otp,
      //   from: "+19105438838",
      //   to: phone,
      // });
    } catch (error) {
      console.log("Twilio Error", error);
    }

    const token = getToken({
      _id: user ?? userExists?._id,
      phone,
      otp,
      shouldValidateOTP: true,
    });
    return token;
  }
}

export default TwilioManager;
