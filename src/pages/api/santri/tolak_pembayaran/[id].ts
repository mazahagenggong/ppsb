import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {cookies} from "next/headers";
import {Admin} from "@/utils/validate/token";
import prisma from "@/utils/prisma";

const getdata = async function (req: NextApiRequest) {
    const cookieStore = req.cookies;
    const token = req.cookies.token ?? null;
    if (!token) {
        return {
            status: 401,
            data: {
                success: false,
                message: "Oooops, Sepertinya anda belum login sebagai admin",
            }
        };
    }
    const cek_token = await Admin(token);
    if (!cek_token.success) {
        return {
            status: 401,
            data: {
                success: false,
                message: "Oooops, Sepertinya anda belum login sebagai admin",
            }
        };
    }
    const reqquery = req.query;
    if (!reqquery.id) {
        return {
            status: 400,
            data: {
                success: false,
                message: "id tidak ada",
            }
        };
    }
    const id = reqquery.id as string;
    try {
        try {
            const update = await prisma.siswa.update({
                where: {
                    id: id
                },
                data: {
                    pembayaran: {
                        delete: true
                    }
                }
            })
            const siswa = await prisma.siswa.findUnique({
                where: {
                    id: id
                },
                include: {
                    pembayaran: true,
                    panitia: true,
                }
            })
            return {
                status: 200,
                data: {
                    success: true,
                    data: siswa,
                    message: "Berhasil menolak pembayaran",
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
    return {
        status: 200,
        data: {
            success: true,
            data: cek_token.data,
            id
        }
    }
    // const reqbody = req.body;
    // const search_list = [
    //     'nama',
    //     'nomor'
    // ];
    // const status = 'semua';
    // const sort_by = {nama: "asc"};
    // try {
    //     try {
    //         const data = await siswacardverif(prisma.siswa, reqbody, search_list, sort_by);
    //         return {
    //             status: data.status,
    //             data: {
    //                 success: true,
    //                 data: data.data
    //             }
    //         }
    //     } catch (e) {
    //         console.log(e)
    //         return {
    //             status: 500,
    //             data: {
    //                 success: false,
    //                 message: "terjadi kesalahan",
    //             }
    //         }
    //     }
    // } finally {
    //     prisma.$disconnect();
    // }
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cors = Cors({
        methods: ['GET'],
    })

    await runMiddleware(req, res, cors);

    switch (req.method) {
        case "GET" :
            const data = await getdata(req);
            return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada"
            })
    }
}