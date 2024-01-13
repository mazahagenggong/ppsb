import moment from "moment";
import axios from "axios";

type PesanType = {
    pesan: string,
    pengirim?: string,
    waktu: string,
}

export const Pesan = async function (data: PesanType) {
    const {pesan, pengirim, waktu} = data;
    const date = moment().format('DD-MM-YYYY');
    const garis = "-------------------------";
    let newPesan = "";
    if (pengirim) {
        newPesan = `Pesan dari : ${pengirim}\n${garis}\n`;
    }
    newPesan = newPesan + `${pesan}\n`;
    newPesan = newPesan + `${garis}\n${date}\n${garis}\n`;
    return newPesan
}

export const KirimFotoSekret = async function (pesan: string, foto: string) {
    const token = "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc";
    try {
        const apiUrl = `https://api.telegram.org/bot${token}/sendPhoto`;
        const kirim = await axios.post(apiUrl, {
            chat_id: "-1001221739649",
            photo: foto,
            caption: pesan,
        });
        return {
            success: true,
            message: "berhasil kirim pesan",
            data: kirim.data
        };
    } catch (e) {
        return {
            success: false,
            message: "gagal kirim pesan",
            error: e
        };
    }
}

export const KirimSekret = async function (pesan: string) {
    const token = "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc";
    try {
        const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        const kirim = await axios.post(apiUrl, {
            chat_id: "-1001221739649",
            text: pesan,
        });
        return {
            success: true,
            message: "berhasil kirim pesan",
            data: kirim.data
        };
    } catch (e) {
        return {
            success: false,
            message: "gagal kirim pesan",
            error: e
        };
    }
}

export const KirimUtama = async function (pesan: string) {
    const token = "1157398763:AAHTYwM2H46rQAjJPzQ6hDdrLgmfDrs-qqk";
    try {
        const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        const kirim = await axios.post(apiUrl, {
            chat_id: "-1001229984666",
            text: pesan,
        });
        return {
            success: true,
            message: "berhasil kirim pesan",
            data: kirim.data
        };
    } catch (e) {
        return {
            success: false,
            message: "gagal kirim pesan",
            error: e
        };
    }
}

export const KirimPribadi = async function (pesan: string) {
    const token = "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc";
    try {
        const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        const kirim = await axios.post(apiUrl, {
            chat_id: "799163200",
            text: pesan,
        });
        return {
            success: true,
            message: "berhasil kirim pesan",
            data: kirim.data
        };
    } catch (e) {
        return {
            success: false,
            message: "gagal kirim pesan",
            error: e
        };
    }
}

export const KirimButtonGambar = async function (id: string, pesan: string, button: any, image: string) {
    const token = "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc";
    try {
        const apiUrl = `https://api.telegram.org/bot${token}/sendPhoto`;
        const kirim = await axios.post(apiUrl, {
            chat_id: id,
            photo: image,
            caption: pesan,
            reply_markup: {
                inline_keyboard: [
                    button,
                ]
            }
        });
        return {
            success: true,
            message: "berhasil kirim pesan",
            data: kirim.data
        };
    } catch (e) {
        return {
            success: false,
            message: "gagal kirim pesan",
            error: e
        };
    }
}
