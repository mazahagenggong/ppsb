import type {NextApiRequest, NextApiResponse} from "next";
import Cors from "cors";
import runMiddleware from "@/utils/runMiddleware";
import {Admin, Panitia} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import {encrypt} from "@/utils/crypt";

const post = async function (req: NextApiRequest) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return {
            status: 401,
            data: {
                success: false,
                message: "Token tidak ada",
            },
        };
    }
    const cek_token = await Panitia(token);
    if (!cek_token.success) {
        return {
            status: 401,
            data: {
                success: false,
                message: cek_token.message,
            },
        };
    }
    const reqbody = req.body;
    if (!reqbody.nama) {
        return {
            status: 401,
            data: {
                success: false,
                message: "Nama tidak ada",
            },
        };
    }
    if (!reqbody.username) {
        return {
            status: 401,
            data: {
                success: false,
                message: "Username tidak ada",
            },
        };
    }
    let {username, nama} = reqbody;
    username= username.toLowerCase().replace(/\s/g, "");
    try {
        try {
            if (username !== cek_token?.data?.username) {
                const cek_username = await prisma.user.findUnique({
                    where: {
                        username: username,
                    },
                });
                if (cek_username) {
                    return {
                        status: 401,
                        data: {
                            success: false,
                            message: "Username sudah dipakai",
                        },
                    };
                }
            }
            const edit = await prisma.user.update({
                where: {
                    id: cek_token?.data?.id,
                },
                data: {
                    username: username,
                    nama: nama,
                },
            });
            return {
                status: 200,
                data: {
                    success: true,
                    data: edit,
                    message: "Berhasil mengedit data",
                },
            };
        } catch (e) {
            console.log(e);
            return {
                status: 500,
                data: {
                    success: false,
                    message: "Terjadi kesalahan",
                },
            };
        }
    } finally {
        prisma.$disconnect();
    }
};
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cors = Cors({
        methods: ["POST"],
    });

    await runMiddleware(req, res, cors);

    switch (req.method) {
        case "POST":
            const data = await post(req);
            return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada",
            });
    }
}
