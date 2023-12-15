export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.error) {
    return error.response.data.error;
  } else if (
    error.response &&
    error.response.data &&
    error.response.data.message
  ) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return "An unexpected error occurred.";
  }
};
