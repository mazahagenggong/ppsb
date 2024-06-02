import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import moment from "moment/moment";
import 'moment/locale/id';
import prisma from "@/utils/prisma";
import {Panitia} from "@/utils/validate/token";

moment.locale('id');

const postdata = async function (req: NextApiRequest) {
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
        const putra = await prisma.siswa.count({
            where:{
                jk: "lk"
            }
        });
        const putri = await prisma.siswa.count({
            where:{
                jk: "pr"
            }
        });
        return {
            status: 200,
            data: {
                putri: putri,
                putra: putra
            }
        }

    } catch (e) {
        return {
            status: 401,
            data: {
                success: false,
                message: "error",
                error: e
            }
        }
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
            const data = await postdata(req);
        return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada"
            })
    }
}