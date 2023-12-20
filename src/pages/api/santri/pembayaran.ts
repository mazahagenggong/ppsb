import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Admin} from "@/utils/validate/token";
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
    if (!reqbody.status) {
        return {
            status: 400,
            data: {
                success: false,
                message: "status tidak ada",
            }
        };
    }
    if (!reqbody.id) {
        return {
            status: 400,
            data: {
                success: false,
                message: "id tidak ada",
            }
        };
    }
    const id = reqbody.id;
    const status = reqbody.status;
    let snt;
    try {
        try {
            const santri = await prisma.siswa.findUnique({
                where: {
                    id: id
                },
                include: {
                    pembayaran: true,
                    panitia: true,
                    gelombang: true,
                }
            });
            if (!santri) {
                return {
                    status: 404,
                    data: {
                        success: false,
                        message: "santri tidak ditemukan",
                    }
                };
            }
            snt = santri;
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
    switch (status) {
        case "tolak":
            try {
                try {
                    if (snt.pembayaran) {
                        await prisma.siswa.update({
                            where: {
                                id: id
                            },
                            data: {
                                pembayaran: {
                                    delete: true
                                }
                            }
                        });
                    }
                    if (snt.panitia) {
                        await prisma.siswa.update({
                            where: {
                                id: id
                            },
                            data: {
                                panitia: {
                                    disconnect: true
                                }
                            }
                        });
                    }
                    return {
                        status: 200,
                        data: {
                            success: true,
                            message: "santri berhasil di tolak",
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
            break;
        case "terima":
            try {
                try {
                    if (snt.pembayaran) {
                        await prisma.siswa.update({
                            where: {
                                id: id
                            },
                            data: {
                                pembayaran: {
                                    update: {
                                        status: "Lunas"
                                    }
                                }
                            }
                        });
                    }
                    return {
                        status: 200,
                        data: {
                            success: true,
                            message: "Pembayaran santri berhasil di terima",
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
            break;
        default:
            return {
                status: 400,
                data: {
                    success: false,
                    message: "status tidak valid",
                }
            };
            break;
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