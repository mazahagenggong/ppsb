import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Admin} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import axios from "axios";
import {KirimUtama} from "@/utils/telegram/chat";

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
    const reqbody = req.body;
    if (!reqbody.id) {
        return {
            status: 400,
            data: {
                success: false,
                message: "id tidak ada",
            }
        };
    }
    try {
        try {
            let deleter: string;
            if (!cek_token?.data?.telegram) {
                deleter = cek_token?.data?.nama ?? "@";
            } else {
                try {
                    const cek_deleter = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChat?chat_id=${cek_token?.data?.telegram}`);
                    deleter = `@${cek_deleter?.data?.result?.username}` ?? "@";
                } catch (e) {
                    deleter = cek_token?.data?.nama ?? "@";
                }
            }
            const siswa = await prisma.siswa.findUnique({
                where: {
                    id: reqbody.id
                },
                include: {
                    alamat: true,
                    pembayaran: true,
                    biodata: true,
                }
            });
            if (!siswa) {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: "data tidak ada",
                    }
                };
            }
            if (siswa.pembayaran) {
                await prisma.pembayaran.delete({
                    where: {
                        id: siswa.pembayaran.id
                    }
                })
            }
            if (siswa.biodata) {
                await prisma.biodata_tambahan.delete({
                    where: {
                        id: siswa.biodata.id
                    }
                })
            }
            await prisma.siswa.delete({
                where: {
                    id: reqbody.id
                }
            });
            if (siswa.alamat){
                await prisma.alamat.delete({
                    where: {
                        id: siswa.alamat.id
                    }
                });
            }
            await KirimUtama(`Data santri "${siswa.nama}" (${siswa.nomor}) telah dihapus oleh ${deleter}`);
            return {
                status: 200,
                data: {
                    success: true,
                    message: "berhasil menghapus data",
                }
            }
        } catch (e) {
            console.log(e)
            return {
                status: 500,
                data: {
                    success: false,
                    message: "terjadi kesalahan",
                }
            }
        }
    } finally {
        prisma.$disconnect();
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