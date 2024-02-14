function Validation(values) {
  let error = {};
  const emailPattren = /^[^\s@]+@[^\s@]+\.[^\s@]$/;
  const passwordPattren =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$/;

  if (values.email === '') {
    error.email = 'eamil Should not be empty ';
  } else if (!emailPattren.test(values.email)) {
    error.email = "Email did't match";
  } else {
    error.email = '';
  }

  if (values.password === '') {
    error.password = 'password Should not be empty';
  } else if (!passwordPattren.test(values.password)) {
    error.password = "password did't match";
  } else {
    error.password = '';
  }
  return error;
}
export default Validation;
