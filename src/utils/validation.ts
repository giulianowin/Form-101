// Validation helper functions
export const isValidName = (name: string) => /^[A-Za-z\s]{3,}$/.test(name);
export const isValidNameInput = (name: string) => /^[A-Za-z\s]*$/.test(name);
export const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
export const isValidPhone = (phone: string) => /^07\d{9}$/.test(phone.replace(/\s/g, ''));