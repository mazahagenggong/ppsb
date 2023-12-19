import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"
import jwt from "jsonwebtoken";

const post = async function (req: NextApiRequest) {
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
    try {
        try {
            const cek_token: any = jwt.verify(token, process.env.JWT_SECRET ?? '');
            if (!cek_token.id) {
                return {
                    status: 401,
                    data: {
                        success: false,
                        message: 'Token tidak valid'
                    }
                }
            }
            const santri_id = await cek_token.id ?? 'xxx';
            const santri = await prisma.siswa.findUnique({
                where: {id: santri_id},
                include: {
                    alamat: true,
                    pembayaran: true,
                    gelombang: true,
                    panitia: true,
                },
            });
            if (!santri) {
                return {
                    status: 401,
                    data: {
                        success: false,
                        message: "user tidak ditemukan",
                    }
                };
            }
            return {
                status: 200,
                data: {
                    success: true,
                    message: "berhasil mengambil data santri",
                    data: santri
                }
            };
        } catch (error: any) {
            return {
                status: 400,
                data: {
                    success: false,
                    message: "Gagal mengambil data santri",
                    error: error instanceof Error ? error.message : "Unknown error",
                }
            };
        }
    } finally {
        await prisma.$disconnect();
    }
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cors = Cors({
        methods: ['POST'],
    })

    await runMiddleware(req, res, cors);

    switch (req.method) {
        case "POST" :
            const data = await post(req);
            return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada"
            })
    }
}