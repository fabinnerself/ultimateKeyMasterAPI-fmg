export const regularExp = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.*[a-zA-Z]).{10,16}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  nameBox: /^(?=.{3,100}$)[a-zA-Z0-9]+$/,
  iconBox: /^[a-zA-Z\s]{2,20}$/, 
  code: /^(?=.{2,20}$)[a-zA-Z0-9]+$/,
  pinVal: /^[0-9]{6}$/
};
