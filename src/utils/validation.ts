// Validation helper functions
export const isValidName = (name: string) => /^[A-Za-z\s]{3,}$/.test(name);
export const isValidNameInput = (name: string) => /^[A-Za-z\s]*$/.test(name);
export const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
export const isValidPhone = (phone: string) => /^0\d{10}$/.test(phone.replace(/\s/g, ''));