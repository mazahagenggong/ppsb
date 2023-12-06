import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"
import {encrypt} from "@/utils/crypt";

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
    if (!reqbody.username) {
        return {
            status: 400,
            data: {
                success: false,
                message: "Username harus di isi",
            }
        };
    }
    if (!reqbody.password) {
        return {
            status: 400,
            data: {
                success: false,
                message: "Password harus di isi",
            }
        };
    }
    const username = reqbody.username;
    const password = encrypt(reqbody.password);

    try {
        const create = await prisma.user.create({
            data: {
                username: username,
                password: password,
                nama: "Admin",
                role: "admin",
            }
        })
        return {
            status: 200,
            data: {
                success: true,
                data: create,
                message: "Data berhasil dibuat",
            }
        };

    } catch (error) {
        return {
            status: 400,
            data: {
                success: false,
                message: "Gagal membuat user",
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