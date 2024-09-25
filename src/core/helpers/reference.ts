export const generateReference = (length:number)=> {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const allChar = upper + lower + numbers
    let reference = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChar.length);
        reference += allChar[randomIndex];
    }
    return reference;
}