import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Santri} from "@/utils/validate/token";
import prisma from "@/utils/prisma";

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
    if (!req.body.gambar_id) {
        return {
            status: 400,
            data: {
                success: false,
                message: "gambar_id tidak ada",
            }
        };
    }
    const cek_token = await Santri(token);
    if (!cek_token.success) {
        return {
            status: 401,
            data: {
                success: false,
                message: cek_token.message,
            }
        };
    }
    const gambar_id = req.body.gambar_id;
    const santri = cek_token.data;
    try {
        const update_santri = await prisma.siswa.update({
            where: {id: santri?.id},
            data: {
                biodata: {
                    update: {
                        foto: gambar_id,
                    }

                }
            }
        });
        return {
            status: 200,
            data: {
                success: true,
                message: "berhasil mengupload foto",
                data: update_santri
            }
        };
    } catch (error: any) {
        console.log(error)
        return {
            status: 400,
            data: {
                success: false,
                message: "gagal mengupload bukti pembayaran",
            }
        };
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