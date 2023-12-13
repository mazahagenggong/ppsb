import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from "cors";
import runMiddleware from "@/utils/runMiddleware";
import prisma from "@/utils/prisma";

const get = async function (req: NextApiRequest) {
    try {
        const data = await prisma.gelombang.findMany({
            orderBy: {
                periode: 'desc'
            }
        });
        return {
            status: 200,
            data: {
                success: true,
                message: "berhasil mengambil data gelombang",
                data: data
            }
        };
    } catch (error: any) {
        console.log(error)
        return {
            status: 400,
            data: {
                success: false,
                message: "Gagal mengambil data gelombang",
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
            const data = await get(req);
            return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada"
            })
    }
}
