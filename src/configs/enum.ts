export enum ENVIRONMENTS {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}

export enum USER_TYPES {
  CUSTOMER = "customer",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  MULTI = "multi",
}

export enum GEO_JSON_TYPES {
  POINT = "Point",
  LINESTRING = "LineString",
  POLYGON = "Polygon",
  MULTIPOINT = "MultiPoint",
  MULTILINESTRING = "MultiLineString",
  MULTIPOLYGON = "MultiPolygon",
}

export enum PAYMENT_ACCOUNT_TYPES {
  BRAINTREE = "braintree",
  STRIPE_CUSTOMER = "stripe_customer",
  STRIPE_ACCOUNT = "stripe_account",
}

export enum NOTIFICATION_TYPES {
  NEW_MESSAGE = "new_message",
  NEW_CONVERSATION = "new_conversation",
}

export enum USER_STATUSES {
  ACTIVE = "active",
  DELETED = "deleted",
}

export enum CONVERSATION_STATUSES {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export enum MESSAGE_STATUSES {
  UNREAD = "unread",
  READ = "read",
  DELETED = "deleted",
}

export enum NOTIFICATION_STATUSES {
  UNREAD = "unread",
  READ = "read",
}
