import moment from "moment";
import {Telegraf} from 'telegraf';

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

export const Bot = async function () {
    const token = "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc";
    return new Telegraf(token)
}

export const Botutama = async function () {
    const token = "1157398763:AAHTYwM2H46rQAjJPzQ6hDdrLgmfDrs-qqk";
    return new Telegraf(token)
}
