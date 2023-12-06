import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"
import {decrypt} from "@/utils/crypt";
import jwt from "jsonwebtoken";

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

    try {
        const cekuser = await prisma.user.findUnique({
            where: { username: username },
        })
        if (!cekuser) {
            return {
                status: 400,
                data: {
                    success: false,
                    message: "Username atau Password salah",
                }
            };
        }
        const password = reqbody.password;
        if (password !== decrypt(cekuser.password)) {
            return {
                status: 400,
                data: {
                    success: false,
                    message: "Username atau Password salah",
                }
            };
        }
        let expires;
        let kadaluarsa;
        if (reqbody.remember) {
            expires = '7d';
            kadaluarsa = '7 hari';
        } else {
            expires = '1d';
            kadaluarsa = '1 hari';
        }
        const token = jwt.sign({id: cekuser?.id}, process.env.JWT_SECRET ?? '', {
            expiresIn: expires,
        });
        let data = {
            id: cekuser.id,
            nama: cekuser.nama,
            username: cekuser.username,
            role: cekuser.role,
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
                message: "Gagal mengambil data user",
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