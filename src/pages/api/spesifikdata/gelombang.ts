import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Panitia} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import moment from "moment/moment";
import 'moment/locale/id';
import Prestasi from "@/components/test/prestasi";

moment.locale('id');

const getdata = async function (req: NextApiRequest) {
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
    try {
        const gel1PresCount = await prisma.siswa.count({
            where: {
                gelombang: {
                    nama: "Gelombang 1"
                },
                prestasiId: {
                    not: null
                }
            }
        });
        const gel1NoPresCount = await prisma.siswa.count({
            where: {
                gelombang: {
                    nama: "Gelombang 1"
                },
                prestasi: {
                    is: null
                }
            }
        });
        const gel2PresCount = await prisma.siswa.count({
            where: {
                gelombang: {
                    nama: "Gelombang 2"
                },
                prestasiId: {
                    not: null
                }
            }
        });
        const gel2NoPresCount = await prisma.siswa.count({
            where: {
                gelombang: {
                    nama: "Gelombang 2"
                },
                prestasi: {
                    is: null
                }
            }
        });
        const gel3PresCount = await prisma.siswa.count({
            where: {
                gelombang: {
                    nama: "Gelombang 3"
                },
                prestasiId: {
                    not: null
                }
            }
        });
        const gel3NoPresCount = await prisma.siswa.count({
            where: {
                gelombang: {
                    nama: "Gelombang 3"
                },
                prestasi: {
                    is: null
                }
            }
        });
        return {
            status: 200,
            data: {
                success: true,
                message: "berhasil mendapatkan data",
                data: {
                    gel1PresCount,
                    gel1NoPresCount,
                    gel2PresCount,
                    gel2NoPresCount,
                    gel3PresCount,
                    gel3NoPresCount
                }
            }
        };
    } catch (e) {
        return {
            status: 500,
            data: {
                success: false,
                message: "gagal mendapatkan data",
            }
        };
    }
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