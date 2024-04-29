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
    try {
        const siswa = await prisma.siswa.findMany({
            // where: {
            //         biodataId: null
            // },
            include: {
                biodata: true,
                pembayaran: true,
            }
        })
        if (!siswa) {
                return {
                    status: 401,
                    data: {
                        success: false,
                        message: "siswa gak ada"
                    }
                }
        }
        let datanya: any[] = [];
        siswa.forEach(function(data) {
            let datasatuan = {
                nomor: data.nomor,
                nama: data.nama,
                status_pembayaran: data?.pembayaran?.status ?? "belum terverifikasi",
                jurusan_awal: data.prejur,
                jurusan_fix: data?.biodata?.jurusan ?? "belum isi",
                biodata: data?.biodata ? "ada" : "belum di isi"
            }
            datanya.push(datasatuan)
        });
        // let newdata;
        return {
            status: 200,
            data: {
                data: datanya
            }
        }

    } catch (e) {
        return {
            status: 401,
            data: {
                success: false,
                message: "error"
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