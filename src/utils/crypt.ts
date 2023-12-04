import {AES, enc} from "crypto-js";

const key = "KodE3nkr1psirah@siayangtiDakbolehdib0corkan";
const encrypt = (data: string): string => {
    return AES.encrypt(data, key).toString();
};

const decrypt = (encryptedData: string): string => {
    const bytes = AES.decrypt(encryptedData, key);
    return bytes.toString(enc.Utf8);
};

export { encrypt, decrypt };