import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import moment from "moment/moment";
import 'moment/locale/id';
import {KirimPribadi, Pesan} from "@/utils/telegram/chat";
import {Admin} from "@/utils/validate/token";
import prisma from "@/utils/prisma";

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
    // try {
    //     const siswa = await prisma.siswa.findUnique({
    //         where: {
    //             id: reqbody.id
    //         },
    //         include: {
    //             prestasi: true
    //         }
    //     })
    //     if (!siswa) {
    //         if (!reqbody.id || reqbody.prestasi) {
    //             return {
    //                 status: 401,
    //                 data: {
    //                     success: false,
    //                     message: "siswa gak ada"
    //                 }
    //             }
    //         }
    //     }
    //     if (siswa?.prestasi) {
    //         try{
    //             await prisma.prestasi.update({
    //                 where: {
    //                     id: siswa.prestasi.id
    //                 },
    //                 data: {
    //                     jenis: reqbody.prestasi
    //                 }
    //             })
    //             return {
    //                 status: 200,
    //                 data: {
    //                     success: true,
    //                     data: "testing"
    //                 }
    //             }
    //         }catch (e) {
    //             return {
    //                 status: 401,
    //                 data: {
    //                     success: false,
    //                     message: "gagal update prestasi"
    //                 }
    //             }
    //         }
    //
    //     } else {
    //         try {
    //             const pres = await prisma.prestasi.create({
    //                 data: {
    //                     jenis: reqbody.prestasi
    //                 }
    //             })
    //             await prisma.siswa.update({
    //                 where: {
    //                     id: reqbody.id
    //                 },
    //                 data: {
    //                     prestasiId: pres.id
    //                 }
    //             })
    //             return {
    //                 status: 200,
    //                 data: {
    //                     success: true,
    //                     data: "testing"
    //                 }
    //             }
    //         } catch (e) {
    //             return {
    //                 status: 401,
    //                 data: {
    //                     success: false,
    //                     message: "gagal buat prestasi"
    //                 }
    //             }
    //         }
    //     }
    // } catch (e) {
    //     return {
    //         status: 401,
    //         data: {
    //             success: false,
    //             message: "error"
    //         }
    //     }
    // }

    return {
        status: 200,
        data: {
            success: true,
            data: "testing"
        }
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
            const data = await postdata(req);
            return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada"
            })
    }
}