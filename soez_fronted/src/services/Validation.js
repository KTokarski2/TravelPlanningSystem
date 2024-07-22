export const isRequired = (value) => {
    return value.trim() !== "";
}

export const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

export const checkLength = (value, min, max) => {
    const length = value.trim().length;
    return length >= min && length <= max;
}