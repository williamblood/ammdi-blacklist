// Checks email address is legitimate
const isEmail = email => {
  const regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regExEmail)) return true;
  else return false;
};

// Validate data i.e. no empty strings on login
const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};

exports.validateSignupData = newUser => {
  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = "Email field must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (isEmpty(newUser.password)) errors.password = "Password cannot be empty";
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "Password does not match";
  if (isEmpty(newUser.handle)) errors.handle = "Handle cannot be empty";

  // Breaks and returns error(s) if there are any detected
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = user => {
  let errors = {};

  if (isEmpty(user.email)) errors.email = "Email cannot be empty";
  if (isEmpty(user.password)) errors.password = "Password cannot be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
