export const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const futureOrToday = (date) => {
  const value = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return value >= today;
};
