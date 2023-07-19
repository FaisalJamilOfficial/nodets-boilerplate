// module imports

// file imports
import admins from "./admins";
import conversations from "./conversations";
import customers from "./customers";
import messages from "./messages";
import notifications from "./notifications";
import paymentAccounts from "./payment-accounts";
import users from "./users";
import userTokens from "./user-tokens";

export default {
  adminsModel: admins,
  conversationsModel: conversations,
  customersModel: customers,
  messagesModel: messages,
  notificationsModel: notifications,
  paymentAccountsModel: paymentAccounts,
  usersModel: users,
  userTokensModel: userTokens,
};
