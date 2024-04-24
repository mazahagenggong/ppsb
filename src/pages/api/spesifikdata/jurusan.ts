import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Panitia} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import moment from "moment/moment";
import 'moment/locale/id';
import Prestasi from "@/components/test/prestasi";

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
        const pk = await prisma.biodata_tambahan.count({
            where: {
                jurusan: "PK"
            }
        });
        const umum = await prisma.biodata_tambahan.count({
            where: {
                jurusan: "UMUM"
            }
        });
        const cektotal = await prisma.siswa.findMany({
            orderBy: {
                id: 'desc'
            },
            include: {
                biodata: true,
                pembayaran: true,
            },
            where: {
                pembayaran: {
                    status: "Lunas"
                }
            }
        })
         const total = cektotal.length

        return {
            status: 200,
            data: {
                success: true,
                message: "berhasil mendapatkan data",
                data: {
                    pk,
                    umum,
                    total,
                }
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