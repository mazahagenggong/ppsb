import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"
import jwt from "jsonwebtoken";
import {Origin} from "@/utils/validate/origin";

const post = async function (req: NextApiRequest) {
    const cekOrigin = await Origin(req);
    if (!cekOrigin.success) {
        return {
            status: 403,
            data: {
                success: false,
                message: "Alamat tidak valid",
            }
        };
    }
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
    if (!reqbody.kode) {
        return {
            status: 400,
            data: {
                success: false,
                message: "Kode login harus di isi",
            }
        };
    }

    try {
        const cek_siswa = await prisma.siswa.findUnique({
            where: {kode: reqbody.kode},
        })
        if (!cek_siswa) {
            return {
                status: 400,
                data: {
                    success: false,
                    message: "Kode login salah",
                }
            };
        }
        const expires = '1d';
        const kadaluarsa = '1 hari';
        const token = jwt.sign({id: cek_siswa.id}, process.env.JWT_SECRET ?? '', {
            expiresIn: expires,
        });
        let data = {
            id: cek_siswa.id,
            nama: cek_siswa.nama,
            nomor_pendaftaran: cek_siswa.nomor,
            token: token,
            expires: kadaluarsa
        }
        return {
            status: 200,
            data: {
                success: true,
                data: data,
                message: "login berhasil"
            }
        };

    } catch (error) {
        return {
            status: 400,
            data: {
                success: false,
                message: "Gagal mengambil data santri",
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