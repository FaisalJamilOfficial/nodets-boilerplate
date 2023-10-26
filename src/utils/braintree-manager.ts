// module imports
// import braintree from "braintree";

// file imports
import { ENVIRONMENTS } from "../configs/enum";

// destructuring assignments
const { PRODUCTION } = ENVIRONMENTS;
const {
  NODE_ENV,
  BRAINTREE_MERCHANT_ID,
  BRAINTREE_PUBLIC_KEY,
  BRAINTREE_PRIVATE_KEY,
} = process.env;

// // variable initializations
// const gateway = new braintree.BraintreeGateway({
//   environment:
//     NODE_ENV === PRODUCTION
//       ? braintree.Environment.Production
//       : braintree.Environment.Sandbox,
//   merchantId: BRAINTREE_MERCHANT_ID,
//   publicKey: BRAINTREE_PUBLIC_KEY,
//   privateKey: BRAINTREE_PRIVATE_KEY,
// });

class BraintreeManager {
  gateway: any;
  constructor() {
    // this.gateway = gateway;
  }

  /**
   * @description Generate a client token
   * @param {String} customerId OPTIONAL braintree customer id
   * @returns {Object} client token
   */
  async generateClientToken(customerId: string) {
    // return await gateway.clientToken.generate({ customerId });
  }

  /**
   * @description Create a braintree customer account
   * @param {String} firstName first name
   * @param {String} lastName last name
   * @param {String} email email address
   * @param {String} phone phone number
   * @param {Object} creditCard credit card data
   * @param {String} paymentMethodNonce nonce token
   * @returns {Object} paymentAccount
   */
  async createCustomer(params: any) {
    const {
      firstName,
      lastName,
      email,
      phone,
      creditCard,
      paymentMethodNonce,
    } = params;
    const customerObj = {
      firstName,
      lastName,
      email,
      phone,
      creditCard,
      paymentMethodNonce,
    };
    // return await gateway.customer.create(customerObj);
  }

  /**
   * @description Delete a customer
   * @param {String} customerId braintree customer id
   * @returns {Object} customer data
   */
  async deleteCustomer(customerId: string) {
    // return await gateway.customer.delete(customerId);
  }

  /**
   * @description Create a braintree payment method
   * @param {Object} customerId braintree customer id
   * @param {String} paymentMethodNonce nonce token
   * @returns {Object} paymentMethod
   */
  async createPaymentMethod(params: any) {
    const { customerId, paymentMethodNonce } = params;
    const paymentMethodObj = { customerId, paymentMethodNonce };
    // return await gateway.paymentMethod.create(paymentMethodObj);
  }

  /**
   * @description Remove a payment method
   * @param {String} token payment method token
   * @returns {Object} payment method data
   */
  async removePaymentMethod(token: string) {
    // return await gateway.paymentMethod.delete(token);
  }

  /**
   * @description Create a transaction
   * @param {Number} amount transaction amount in smaller units of currency
   * @param {String} customerId braintree customer id
   * @param {String} paymentMethodNonce nonce token
   * @param {String} paymentMethodToken method token
   * @param {String} deviceData OPTIONAL device data
   * @returns {Object} transaction
   */
  async saleTransaction(params: any) {
    const {
      amount,
      customerId,
      paymentMethodNonce,
      paymentMethodToken,
      deviceData,
    } = params;

    const transactionObj = {
      amount: Number(amount).toFixed(2),
      customerId,
      paymentMethodToken,
      paymentMethodNonce,
      deviceData,
      options: {
        submitForSettlement: false,
      },
    };
    // return await gateway.transaction.sale(transactionObj);
  }

  /**
   * @description Submit transaction for settlement
   * @param {String} transactionId braintree transaction id
   * @param {Number} amount transaction amount in smaller units of currency
   * @returns {Object} transaction
   */
  async adjustTransaction(params: any) {
    const { transactionId, amount } = params;
    // return await gateway.transaction.adjustAuthorization(transactionId, {
    //   amount,
    // });
  }

  /**
   * @description Adjust authorized transaction
   * @param {String} transactionId braintree transaction id
   * @returns {Object} transaction
   */
  async submitTransaction(transactionId: string) {
    // return await gateway.transaction.submitForSettlement(transactionId);
  }

  /**
   * @description Void a transaction
   * @param {String} transactionId braintree transaction id
   * @returns {Object} transaction
   */
  async voidTransaction(transactionId: string) {
    // return await gateway.transaction.void(transactionId);
  }

  /**
   * @description Hold a transaction
   * @param {String} transactionId braintree transaction id
   * @returns {Object} transaction hold data
   */
  async holdTransaction(transactionId: string) {
    // return await gateway.transaction.holdInEscrow(transactionId);
  }

  /**
   * @description Refund a transaction
   * @param {String} transactionId braintree transaction id
   * @returns {Object} transaction refund data
   */
  async refundTransaction(transactionId: string) {
    // return await gateway.transaction.refund(transactionId);
  }

  /**
   * @description Release a transaction
   * @param {String} transactionId braintree transaction id
   * @returns {Object} transaction refund data
   */
  async releaseTransaction(transactionId: string) {
    // return await gateway.transaction.releaseFromEscrow(transactionId);
  }
}

export default BraintreeManager;
