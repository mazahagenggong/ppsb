import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import moment from "moment/moment";
import 'moment/locale/id';
import {KirimPribadi, Pesan} from "@/utils/telegram/chat";
import {Admin} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import biodata from "@/components/santri/biodata";

moment.locale('id');

const postdata = async function (req: NextApiRequest) {
    // const reqbody = req.body
    // if (!reqbody.id || !reqbody.prestasi) {
    //     return {
    //         status: 401,
    //         data: {
    //             success: false,
    //             message: "gagal"
    //         }
    //     }
    // }
    try {
        const putra = await prisma.siswa.count({
            where:{
                jk: "lk"
            }
        });
        const putri = await prisma.siswa.count({
            where:{
                jk: "pr"
            }
        });
        // const siswa = await prisma.siswa.findMany({
        //     where: {
        //         pembayaran: {
        //             status: "Lunas",
        //             AND: {
        //
        //             }
        //         },
        //     },
        //     select: {
        //         nama: true
        //     }
        // });
        return {
            status: 200,
            data: {
                putri: putri,
                putra: putra
            }
        }
        // const putra = await prisma.siswa.count({
        //     where: {
        //             jk: "lk"
        //     }
        // });
        // const putri = await prisma.siswa.count({
        //     where: {
        //         jk: "pr"
        //     }
        // })
        // if (!putra) {
        //     return {
        //         status: 401,
        //         data: {
        //             success: false,
        //             message: "putra gak ada"
        //         }
        //     }
        // }
        // if (!putri) {
        //     return {
        //         status: 401,
        //         data: {
        //             success: false,
        //             message: "putri gak ada"
        //         }
        //     }
        // }
        // return {
        //     status: 200,
        //     data: {
        //         putra: putra,
        //         putri: putri
        //     }
        // }

    } catch (e) {
        return {
            status: 401,
            data: {
                success: false,
                message: "error",
                error: e
            }
        }
    }

    // return {
    //     status: 200,
    //     data: {
    //         success: true,
    //         data: "testing"
    //     }
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
            const data = await postdata(req);
        return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada"
            })
    }
}