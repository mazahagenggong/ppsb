import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from "cors";
import runMiddleware from "@/utils/runMiddleware";
import prisma from "@/utils/prisma";
import {Admin} from "@/utils/validate/token";

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
    const verified = await Admin(token);
    if (!verified.success) {
        return {
            status: 401,
            data: {
                success: false,
                message: verified.message,
            }
        };
    }
    const body = req.body;
    try {
        const data = await prisma.gelombang.create({
            data: {
                periode: body.periode,
                nama: body.nama,
                keterangan: body.durasi,
                biaya: body.biayaPendaftaran,
                active: false,
            }
        });
        if (!data) {
            return  {
                status: 400,
                data: {
                    success: false,
                    message: "Gagal membuat data gelombang",
                }
            };
        }
        return {
            status: 200,
            data: {
                success: true,
                message: "Berhasil membuat data gelombang",
                data: data
            }
        };
    } catch (error: any) {
        console.log(error)
        return {
            status: 400,
            data: {
                success: false,
                message: "Gagal membuat data gelombang",
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
