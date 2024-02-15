// module imports
// import Stripe from "stripe";

// file imports
import * as paymentAccountController from "../modules/payment-account/controller";
import * as userController from "../modules/user/controller";
import { PAYMENT_ACCOUNT_TYPES } from "../configs/enum";

// destructuring assignments
const { STRIPE_SECRET_KEY, STRIPE_ENDPOINT_SECRET } = process.env;
const { STRIPE_ACCOUNT, STRIPE_CUSTOMER } = PAYMENT_ACCOUNT_TYPES;

// variable initializations
// const stripe = new Stripe(STRIPE_SECRET_KEY || "");
const CURRENCY = "usd";

class StripeManager {
  stripe: any;
  constructor() {
    // this.stripe = stripe;
  }

  /**
   * @description Create stripe token
   * @param {String} number card number
   * @param {String} expMonth expiry month
   * @param {String} expYear expiry year
   * @param {String} cvc card cvc
   * @param {String} name user name
   * @returns {Object} stripe token
   */
  async createToken(params: any) {
    const { number, expMonth, expYear, cvc, name } = params;
    const card: any = {};
    if (number) card.number = number;
    if (typeof expMonth === "number") card.expMonth = expMonth;
    if (typeof expYear === "number") card.expYear = expYear;
    if (cvc) card.cvc = cvc;
    if (name) card.name = name;
    // return await stripe.tokens.create({ card });
  }

  /**
   * @description Delete stripe customer
   * @param {String} customerId stripe customer id
   * @returns {Object} stripe customer deletion response
   */
  async deleteCustomer(customerId: string) {
    // return await stripe.customers.del(customerId);
  }

  /**
   * @description Delete stripe customers
   * @returns {Object} stripe customers deletion response
   */
  async deleteAllCustomers() {
    // const customersObj = await stripe.customers.list({ limit: 500 });
    // const customers = customersObj.data;
    // for (let index = 0; index < customers.length; index++) {
    //   const element = customers[index];
    //   try {
    //     this.deleteCustomer(element.id);
    //   } catch (e) {
    //     console.log("e =>", e);
    //   }
    // }
  }

  /**
   * @description Create stripe customers
   * @returns {Object} stripe customers creation response
   */
  async createAllCustomers() {
    const query: any = { limit: Math.pow(2, 32) };
    const { data: users } = await userController.getElements(query);
    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      const id = "";
      await this.createCustomer({
        id: element?._id.toString(),
        email: element?.email,
      });
    }
  }

  /**
   * @description Refund stripe charge
   * @param {String} charge stripe charge id
   * @returns {Object} stripe charge refund response
   */
  async createRefund(charge: string) {
    // return await stripe.refunds.create({ charge });
  }

  /**
   * @description Create stripe charge
   * @param {String} customer stripe customer id
   * @param {String} amount charge amount in currency smallest unit
   * @param {String} currency amount currency e.g "usd"
   * @param {String} source stripe source token
   * @param {String} description charge description
   * @returns {Object} stripe charge response
   */
  async createCharge(params: any) {
    const { customer, amount, currency, source, description } = params;
    const chargeObj = {
      currency: currency ?? CURRENCY,
      customer,
      amount,
      source,
      description,
    };

    // return await stripe.charges.create(chargeObj);
  }

  /**
   * @description Create stripe customer source with customer existence check
   * @param {String} source stripe source token
   * @param {String} cardHolderName user card title
   * @param {String} user user id
   * @param {String} email OPTIONAL user email address
   * @returns {Object} paymentAccount
   */
  async createCustomerSourceWithCheck(params: any) {
    const { source, cardHolderName, user, email, phone } = params;

    const paymentAccountExists = await paymentAccountController.getElement(
      user
    );

    let userStripeId;

    if (paymentAccountExists)
      userStripeId = paymentAccountExists.account.stripeId;
    else {
      const customerObj: any = {};
      if (email) customerObj.email = email;
      if (phone) customerObj.phone = phone;
      // const customer = await stripe.customers.create(customerObj);
      // userStripeId = customer?.id;
    }
    // const card = await stripe.customers.createSource(userStripeId, {
    //   source,
    // });

    // card.cardHolderName = cardHolderName;
    // const paymentAccountObj = {
    //   user,
    //   type: STRIPE_CUSTOMER,
    //   account: card,
    // };
    // const paymentAccount = await paymentAccountController.addPaymentAccount(
    //   paymentAccountObj
    // );
    // return paymentAccount;
  }

  /**
   * @description Create stripe customer
   * @param {String} id OPTIONAL user id
   * @param {String} email OPTIONAL user email address
   * @param {String} phone OPTIONAL user phone number
   * @returns {Object} stripe customer data
   */
  async createCustomer(params: any) {
    const { id, email, phone } = params;
    const customerObj = { id, email, phone };
    // return await stripe.customers.create(customerObj);
  }

  /**
   * @description Create stripe express account with account existence check
   * @param {String} user user id
   * @param {String} email user email address
   * @returns {Object} paymentAccount
   */
  async createAccountWithCheck(params: any) {
    const { user, email } = params;
    const paymentAccountExists = await paymentAccountController.getElement(
      user
    );

    if (paymentAccountExists) return paymentAccountExists;
    else {
      // const account = await stripe.accounts.create({
      //   email,
      //   type: "express",
      //   capabilities: {
      //     card_payments: {
      //       requested: true,
      //     },
      //     transfers: {
      //       requested: true,
      //     },
      //   },
      // });
      // const paymentAccountObj = {
      //   user,
      //   type: STRIPE_ACCOUNT,
      //   account,
      // };
      // const paymentAccount = await paymentAccountController.addPaymentAccount(
      //   paymentAccountObj
      // );
      // return paymentAccount;
    }
  }

  /**
   * @description Create stripe account sign up link
   * @param {String} account stripe account id
   * @param {String} refreshUrl redirect url for link expiration or invalidity
   * @param {String} returnUrl redirect url for completion or incompletion linked flow
   * @returns {Object} stripe account link
   */
  async createAccountLink(params: any) {
    const { account, refreshURL, returnURL, email, user } = params;

    const paymentAccountExists = await paymentAccountController.getElement(
      user
    );

    let accountObj;
    if (paymentAccountExists) accountObj = paymentAccountExists.account;
    else {
      // accountObj = await stripe.accounts.create({
      //   type: "custom",
      //   country: "US",
      //   email,
      //   capabilities: {
      //     card_payments: { requested: true },
      //     transfers: { requested: true },
      //   },
      // });
      const paymentAccountObj = {
        user,
        account: accountObj,
        type: STRIPE_CUSTOMER,
      };
      await paymentAccountController.addElement(paymentAccountObj);
    }
    const accountLinkObj = {
      account: account ?? accountObj.id,
      refresh_url: refreshURL ?? "https://app.page.link/stripefailed",
      return_url: returnURL ?? "https://app.page.link/stripesuccess",
      type: "account_onboarding",
    };
    // return await stripe.accountLinks.create(accountLinkObj);
  }

  /**
   * @description Create stripe topUp
   * @param {String} amount topUp amount in smaller units of currency
   * @param {String} currency amount currency e.g "usd"
   * @param {String} description OPTIONAL topUp description
   * @param {String} statementDescriptor OPTIONAL statement description e.g "Top-up"
   * @returns {Object} stripe topUp response
   */
  async createTopUp(params: any) {
    const { amount, currency, description, statementDescriptor } = params;
    const topUpObj = {
      amount,
      currency: currency ?? CURRENCY,
      description,
      statementDescriptor,
    };
    // return await stripe.topUps.create(topUpObj);
  }

  /**
   * @description Create stripe transfer
   * @param {String} user user id
   * @param {String} amount transfer amount in smaller units of currency
   * @param {String} currency amount currency e.g "usd"
   * @param {String} destination destination stripe account
   * @param {String} description OPTIONAL transfer description
   * @returns {Object} stripe transfer response
   */
  async createTransfer(params: any) {
    const { user, amount, currency, description } = params;
    const paymentAccountExists = await paymentAccountController.getElement(
      user
    );
    const transferObj = {
      amount,
      currency: currency ?? CURRENCY,
      destination: paymentAccountExists?.account?._id,
      description,
    };
    if (paymentAccountExists)
      transferObj.destination = paymentAccountExists.account.id;

    // return await stripe.transfers.create(transferObj);
  }

  /**
   * Create stripe payment intent
   * @param {String} customer customer id
   * @param {String} amount payment amount
   * @param {String} currency payment currency
   * @param {[String]} payment_method_types payment method types
   * @returns {Object} stripe payment intent object
   */
  async createPaymentIntent(params: any) {
    const { amount, currency, paymentMethodTypes, customer, paymentMethod } =
      params;
    const paymentIntentObj: any = {
      amount: Number(amount * 100).toFixed(0),
      currency: currency ?? "usd",
      setup_future_usage: "on_session",
      customer,
    };
    if (paymentMethod) paymentIntentObj.payment_method = paymentMethod;
    if (paymentMethodTypes)
      paymentIntentObj.payment_method_types = paymentMethodTypes;

    // return await stripe.paymentIntents.create(paymentIntentObj);
  }

  /**
   * Capture payment intent
   * @param {String} paymentIntent payment intent id
   * @param {String} amount payment amount
   * @returns {Object} capture payment intent object
   */
  async capturePaymentIntent(params: any) {
    const { paymentIntent, amount } = params;
    const paymentIntentObj = {
      amount_to_capture: amount * 100,
    };
    // return await stripe.paymentIntents.capture(paymentIntent, paymentIntentObj);
  }

  /**
   * Cancel payment intent
   * @param {String} paymentIntent payment intent id
   * @returns {Object} cancel payment intent object
   */
  async cancelPaymentIntent(paymentIntent: string) {
    // return await stripe.paymentIntents.cancel(paymentIntent);
  }

  /**
   * Refund payment intent
   * @param {String} paymentIntent payment intent id
   * @returns {Object} refund payment intent object
   */
  async refundPaymentIntent(paymentIntent: string) {
    // return await stripe.refunds.create({ payment_intent: paymentIntent });
  }

  /**
   * Get customer sources
   * @param {String} customer customer id
   * @returns {[object]} stripe customer sources
   */
  async getCustomerSources(params: any) {
    const { customer, limit, startingAfter, endingBefore } = params;
    // return await stripe.paymentMethods.list({
    //   customer,
    //   type: "card",
    //   limit,
    //   starting_after: startingAfter,
    //   ending_before: endingBefore,
    // });
  }

  /**
   * @description Construct stripe webhook event
   * @param {String} rawBody body from stripe request
   * @param {String} signature stripe signature from request headers
   * @param {String} endpointSecret stripe CLI webhook secret
   * @returns {Object} stripe webhook event
   */
  async constructWebhooksEvent(params: any) {
    const { rawBody, signature } = params;

    const rawBodyString = JSON.stringify(rawBody, null, 2);

    // const header = stripe.webhooks.generateTestHeaderString({
    //   payload: rawBodyString,
    //   secret: STRIPE_ENDPOINT_SECRET,
    // });

    // const event = stripe.webhooks.constructEvent(
    //   rawBodyString,
    //   signature ?? header,
    //   STRIPE_ENDPOINT_SECRET
    // );

    // if (event.type === "account.external_account.created") {
    //   console.log("EVENT: ", JSON.stringify(event));

    //   const paymentAccountExists =
    //     await paymentAccountController.getPaymentAccount({
    //       key: "account.id",
    //       value: rawBody.account,
    //     });
    //   await userController.updateUser({
    //     user: paymentAccountExists?.user,
    //     isStripeConnected: true,
    //   });
    // }
    // return event;
  }
}

export const constructWebhooksEvent = async (params: any) => {
  const { request } = params;
  const signature = request.headers["stripe-signature"];
  console.log("SIGNATURE: ", JSON.stringify(signature));

  const args = { rawBody: request.body };

  const event = await new StripeManager().constructWebhooksEvent(args);

  return {
    message: "Done",
    event,
  };
};

export default StripeManager;
