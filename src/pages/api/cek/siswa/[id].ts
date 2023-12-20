import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"
import {Admin} from "@/utils/validate/token";

const get = async function (req: NextApiRequest) {
    if (!req.query.id){
        return {
            status: 400,
            data: {
                success: false,
                message: "id tidak valid",
            }
        };
    }
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
    const cek_token = await Admin(token);
    if (!cek_token.success) {
        return {
            status: 401,
            data: {
                success: false,
                message: cek_token.message,
            }
        };
    }

    const id = req.query.id as string;
    try {
        const ceksiswa = await prisma.siswa.findUnique({
            where: { id: id },
            include: {
                alamat: true,
                gelombang: true,
                pembayaran: true,
                panitia: true,
            }
        })
        if (!ceksiswa) {
            return {
                status: 400,
                data: {
                    success: false,
                    message: "Data tidak ditemukan",
                }
            };
        }

        return {
            status: 200,
            data: {
                success: true,
                data: ceksiswa,
                message: "Data berhasil didapatkan",
            }
        };

    } catch (error) {
        return {
            status: 400,
            data: {
                success: false,
                message: "Gagal mengambil data siswa",
                error: error instanceof Error ? error.message : "Unknown error",
            }
        };
    } finally {
        await prisma.$disconnect();
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