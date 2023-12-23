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
    if (!reqbody.password) {
        return {
            status: 401,
            data: {
                success: false,
                message: "Password tidak ada",
            },
        };
    }
    const {password} = reqbody;
    try {
        try {
            const new_password = await encrypt(password);
            const edit = await prisma.user.update({
                where: {
                    id: cek_token?.data?.id,
                },
                data: {
                    password: new_password,
                },
            });
            return {
                status: 200,
                data: {
                    success: true,
                    data: edit,
                    message: "Berhasil mengubah password",
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
