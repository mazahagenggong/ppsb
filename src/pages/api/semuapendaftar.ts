import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Panitia} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import moment from "moment/moment";
import 'moment/locale/id';
import {Pesan, Bot} from "@/utils/telegram/chat";

moment.locale('id');

const getdata = async function (req: NextApiRequest) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return {
            status: 401,
            data: {
                success: false,
                message: "token tidak ada",
            }
        };
    }
    const cek_token = await Panitia(token);
    if (!cek_token.success) {
        return {
            status: 401,
            data: {
                success: false,
                message: cek_token.message,
            }
        };
    }
    try {
        const data = await prisma.siswa.findMany({
            orderBy: {
                id: 'desc'
            },
            include: {
                alamat: true,
                biodata: true,
                panitia: true,
                pembayaran: true,
                gelombang: true
            }
        })
        return {
            status: 200,
            data: {
                success: true,
                message: "berhasil mendapatkan data",
                data: data
            }
        };
    } catch (e) {
        return {
            status: 500,
            data: {
                success: false,
                message: "gagal mendapatkan data",
            }
        };
    }
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cors = Cors({
        methods: ['GET'],
    })

    await runMiddleware(req, res, cors);

    switch (req.method) {
        case "GET" :
            const data = await getdata(req);
            return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada"
            })
    }
}