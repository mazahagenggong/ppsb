import type {NextApiRequest, NextApiResponse} from 'next';
import Cors from 'cors';
import runMiddleware from "@/utils/runMiddleware";
import {Admin} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import {Bot, Pesan} from "@/utils/telegram/chat";
import moment from "moment";
import 'moment/locale/id';

moment.locale('id');
const formatDate = (createdAt: any) => {
    if (createdAt) {
        return moment(createdAt).format('DD MMMM YYYY');
    } else {
        return "";
    }
};
const getdata = async function (req: NextApiRequest) {
    const server = req.headers.host ?? '';
    const date = moment().format('DD-MM-YYYY');
    const bot = await Bot();
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
                        update: {
                            status: "Lunas"
                        }
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
                    gelombang: true,
                }
            })
            let pesan = `Nama : ${siswa?.nama}\n`;
            pesan = pesan + `Nomor Pendaftaran : ${siswa?.nomor}\n`;
            pesan = pesan + `Kode Login : ${siswa?.kode}\n`;
            pesan = pesan + `Waktu Pembayaran : ${formatDate(siswa?.created_at ?? null)}\n`;
            pesan = pesan + `Gelombang : ${siswa?.gelombang?.nama}\n`;
            pesan = pesan + `Biaya Pendaftaran : ${siswa?.gelombang?.biaya}\n`;
            pesan = pesan + `Metode Pembayaran : Via ${siswa?.panitia?.nama ? 'Panitia (' + siswa?.panitia?.nama + ')' : 'Transfer'}\n`;
            pesan = pesan + `Status Pembayaran : Lunas\n`;
            pesan = pesan + `Telah mendaftar dan melakukan pembayaran`;
            pesan = await Pesan({
                pesan: pesan,
                pengirim: server,
                waktu: date,
            })
            const cdname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
            const imgurl = `https://res.cloudinary.com/${cdname}/${siswa?.pembayaran?.bukti}`;
            try {
                await bot.telegram.sendPhoto("-1001221739649", siswa?.pembayaran?.bukti ? imgurl :  "https://bodybigsize.com/wp-content/uploads/2020/02/noimage-10.png", {
                    caption: pesan,
                });
                console.log(`Message sent successfully`);
            } catch (e) {
                console.log(`Error sending message :`, e);
            }
            return {
                status: 200,
                data: {
                    success: true,
                    data: siswa,
                    message: "Berhasil memverifikasi pembayaran",
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