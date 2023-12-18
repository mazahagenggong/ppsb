import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"

const post = async function (req: NextApiRequest) {
    const reqbody = req.body;
    if (!reqbody) {
        return {
            status: 400,
            data: {
                success: false,
                message: "Data tidak ditemukan",
            }
        };
    }
    if (!reqbody.id) {
        return {
            status: 400,
            data: {
                success: false,
                message: "ID tidak ditemukan",
            }
        };
    }
    const id = reqbody.id;

    try {
        const ceksiswa = await prisma.siswa.findUnique({
            where: { id: id },
            include: {
                alamat: true,
                gelombang: true,
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