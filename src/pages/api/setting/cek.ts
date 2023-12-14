import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from "cors";
import runMiddleware from "@/utils/runMiddleware";
import prisma from "@/utils/prisma";

const getdata = async function (req: NextApiRequest) {
    try {
        const data = await prisma.settingan.findMany({
            orderBy: {
                nama: 'asc'
            }
        });
        if (!data) {
            return {
                status: 400,
                data: {
                    success: false,
                    message: "Gagal mengambil data setting",
                }
            };
        }
        return {
            status: 200,
            data: {
                success: true,
                data: data,
                message: "berhasil"
            }
        };
    } catch (e) {
        return {
            status: 400,
            data: {
                success: false,
                message: "Gagal mengambil data setting",
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
