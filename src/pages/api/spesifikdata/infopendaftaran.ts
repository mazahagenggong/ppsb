import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import moment from "moment/moment";
import 'moment/locale/id';
import prisma from "@/utils/prisma";

moment.locale('id');

const postdata = async function (req: NextApiRequest) {
    try {
        const medsos = await prisma.siswa.count({
            where:{
                ip:"MEDSOS"
            },
        })

        const website = await prisma.siswa.count({
            where:{
                ip:"WEBSITE"
            },
        })

        const bb = await prisma.siswa.count({
            where:{
                ip:"BROSUR/BANNER"
            },
        })

        const kt = await prisma.siswa.count({
            where:{
                ip:"KELUARGA/TEMAN"
            },
        })

        const alumni = await prisma.siswa.count({
            where:{
                ip:"ALUMNI"
            },
        })

        const total = medsos + website + bb + kt + alumni;

        return {
            status: 200,
            data: {
                success: true,
                message: "berhasil mendapatkan data",
                data:  {
                    medsos,
                    website,
                    bb,
                    kt,
                    alumni,
                    total
                }
            }
        };

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