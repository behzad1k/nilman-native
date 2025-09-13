type apiError = {
  [key: string]: string;
}
const API_ERRORS: apiError = {
  '1007': "wrongDiscountCode",
  '1008': "discountCodeInactive",
  '1009': "discountCodeMaxedOut",
  '1010': "unAuthorizedDiscountCode",
  '1012': "invalidDiscountService",
  '1013': "discountCodeExpired",
  '1014': "discountCodeInUse",
  '1015': "invalidDateTimeOrder",
  '1016': "minimumCartNotReached",
  '1017': "unableToDeletePaidOrder",
  '3000': "unableToSubmitDifferentOrderServices"
}
export default API_ERRORS;