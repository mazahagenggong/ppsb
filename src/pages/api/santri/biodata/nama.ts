import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Panitia} from "@/utils/validate/token";
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
    if (!reqbody.nama) {
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
            const edit = await prisma.siswa.update({
                where:{
                    id:reqbody.id
                },
                data:{
                    nama:reqbody.nama.toUpperCase().trim()
                }
            })
            return {
                status: 200,
                data:{
                    success:true,
                    data: edit,
                    message: "Berhasil edit nama"
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