// module imports
// import braintree from "braintree";

// file imports
import { ENVIRONMENTS } from "../configs/enums.js";

// destructuring assignments
const { DEVELOPMENT } = ENVIRONMENTS;
const {
  NODE_ENV,
  BRAINTREE_MERCHANT_ID,
  BRAINTREE_PUBLIC_KEY,
  BRAINTREE_PRIVATE_KEY,
} = process.env;

// // variable initializations
// const productionGateway = {
//   environment: braintree.Environment.Production,
//   merchantId: BRAINTREE_MERCHANT_ID,
//   publicKey: BRAINTREE_PUBLIC_KEY,
//   privateKey: BRAINTREE_PRIVATE_KEY,
// };
// const sandboxGateway = {
//   environment: braintree.Environment.Sandbox,
//   merchantId: BRAINTREE_MERCHANT_ID,
//   publicKey: BRAINTREE_PUBLIC_KEY,
//   privateKey: BRAINTREE_PRIVATE_KEY,
// };
// const gateway = new braintree.BraintreeGateway(
//   NODE_ENV === DEVELOPMENT ? sandboxGateway : productionGateway
//   // NODE_ENV === PRODUCTION ? sandboxGateway : productionGateway
// );

class BraintreeManager {
  gateway: any;
  constructor() {
    // this.gateway = gateway;
  }

  //   /**
  //    * @description Generate a client token
  //    * @param {String} customerId OPTIONAL braintree customer id
  //    * @returns {Object} client token
  //    */
  //   async generateClientToken(params: any) {
  //     const { customerId } = params;
  //     const clientTokenObj = { customerId };
  //     return await gateway.clientToken.generate(clientTokenObj);
  //   }

  //   /**
  //    * @description Create a braintree customer account
  //    * @param {String} firstName first name
  //    * @param {String} lastName last name
  //    * @param {String} email email address
  //    * @param {String} phone phone number
  //    * @param {Object} creditCard credit card data
  //    * @param {String} paymentMethodNonce nonce token
  //    * @returns {Object} paymentAccount
  //    */
  //   async createCustomer(params: any) {
  //     const {
  //       firstName,
  //       lastName,
  //       email,
  //       phone,
  //       creditCard,
  //       paymentMethodNonce,
  //     } = params;
  //     const customerObj = {
  //       firstName,
  //       lastName,
  //       email,
  //       phone,
  //       creditCard,
  //       paymentMethodNonce,
  //     };
  //     const response = await gateway.customer.create(customerObj);
  //     if (response.success) return response;
  //     else throw new Error(response?.message);
  //   }

  //   /**
  //    * @description Delete a customer
  //    * @param {String} customerId braintree customer id
  //    * @returns {Object} customer data
  //    */
  //   async deleteCustomer(params: any) {
  //     const { customerId } = params;
  //     return await gateway.customer.delete(customerId);
  //   }

  //   /**
  //    * @description Create a braintree payment method
  //    * @param {Object} customerId braintree customer id
  //    * @param {String} paymentMethodNonce nonce token
  //    * @returns {Object} paymentMethod
  //    */
  //   async createPaymentMethod(params: any) {
  //     const { customerId, paymentMethodNonce } = params;
  //     const paymentMethodObj = { customerId, paymentMethodNonce };
  //     const response = await gateway.paymentMethod.create(paymentMethodObj);
  //     if (response.success) return response;
  //     else throw new Error(response?.message);
  //   }

  //   /**
  //    * @description Remove a payment method
  //    * @param {String} token payment method token
  //    * @returns {Object} payment method data
  //    */
  //   async removePaymentMethod(params: any) {
  //     const { token } = params;
  //     return await gateway.paymentMethod.delete(token);
  //   }

  //   /**
  //    * @description Create a transaction
  //    * @param {Number} amount transaction amount in smaller units of currency
  //    * @param {String} customerId braintree customer id
  //    * @param {String} paymentMethodNonce nonce token
  //    * @param {String} paymentMethodToken method token
  //    * @param {String} deviceData OPTIONAL device data
  //    * @returns {Object} transaction
  //    */
  //   async saleTransaction(params: any) {
  //     const {
  //       amount,
  //       customerId,
  //       paymentMethodNonce,
  //       paymentMethodToken,
  //       deviceData,
  //     } = params;

  //     const transactionObj = {
  //       amount: Number(amount).toFixed(2),
  //       customerId,
  //       paymentMethodToken,
  //       paymentMethodNonce,
  //       deviceData,
  //       options: {
  //         submitForSettlement: false,
  //       },
  //     };
  //     return await gateway.transaction.sale(transactionObj);
  //   }

  //   /**
  //    * @description Submit transaction for settlement
  //    * @param {String} transactionId braintree transaction id
  //    * @param {Number} amount transaction amount in smaller units of currency
  //    * @returns {Object} transaction
  //    */
  //   async adjustTransaction(params: any) {
  //     const { transactionId, amount } = params;
  //     return await gateway.transaction.adjustAuthorization(transactionId, {
  //       amount,
  //     });
  //   }

  //   /**
  //    * @description Adjust authorized transaction
  //    * @param {String} transactionId braintree transaction id
  //    * @returns {Object} transaction
  //    */
  //   async submitTransaction(params: any) {
  //     const { transactionId } = params;
  //     return await gateway.transaction.submitForSettlement(transactionId);
  //   }

  //   /**
  //    * @description Void a transaction
  //    * @param {String} transactionId braintree transaction id
  //    * @returns {Object} transaction
  //    */
  //   async voidTransaction(params: any) {
  //     const { transactionId } = params;
  //     return await gateway.transaction.void(transactionId);
  //   }

  //   /**
  //    * @description Hold a transaction
  //    * @param {String} transactionId braintree transaction id
  //    * @returns {Object} transaction hold data
  //    */
  //   async holdTransaction(params: any) {
  //     const { transactionId } = params;
  //     const hold = await gateway.transaction.holdInEscrow(transactionId);
  //     return hold;
  //   }

  //   /**
  //    * @description Refund a transaction
  //    * @param {String} transactionId braintree transaction id
  //    * @returns {Object} transaction refund data
  //    */
  //   async refundTransaction(params: any) {
  //     const { transactionId } = params;
  //     return await gateway.transaction.refund(transactionId);
  //   }

  //   /**
  //    * @description Release a transaction
  //    * @param {String} transactionId braintree transaction id
  //    * @returns {Object} transaction refund data
  //    */
  //   async releaseTransaction(params: any) {
  //     const { transactionId } = params;
  //     return await gateway.transaction.releaseFromEscrow(transactionId);
  //   }
}

export default BraintreeManager;
