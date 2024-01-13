import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"
import {Origin} from "@/utils/validate/origin";
import moment from "moment";
import {Bot, Botutama, Pesan} from "@/utils/telegram/chat";

const generateRandomCode = async (): Promise<string> => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString().slice(0, 6);
    const existingSiswa = await prisma.siswa.findUnique({
        where: {kode: randomCode},
    });

    if (existingSiswa) {
        return generateRandomCode();
    }

    return randomCode;
};

const formatDate = (createdAt: any) => {
    if (createdAt) {
        return moment(createdAt).format('DD MMMM YYYY');
    } else {
        return "";
    }
};

const generatenomoreg = async (): Promise<string> => {
    const currentYear = new Date().getFullYear();

    const lastRegisteredNomor = await prisma.siswa.findFirst({
        orderBy: {nomor: 'desc'},
    });

    let totalSiswa = lastRegisteredNomor ? parseInt(lastRegisteredNomor.nomor.slice(4)) + 1 : 1;

    if (!lastRegisteredNomor && totalSiswa === 1) {
        totalSiswa = 1;
    }
    const nomorReg = `${currentYear}${totalSiswa.toString().padStart(4, '0')}`;

    return nomorReg;
}

const post = async function (req: NextApiRequest) {
    const cekOrigin = await Origin(req);
    if (!cekOrigin.success) {
        return {
            status: 403,
            data: {
                success: false,
                message: "Alamat tidak valid",
            }
        };
    }
    const reqbody = req.body;
    const kode = await generateRandomCode();
    const nomor = await generatenomoreg();

    try {
        const gelombang = await prisma.gelombang.findFirst({
            where: {
                active: true,
            },
        });
        if (!gelombang) {
            return {
                status: 400,
                data: {
                    success: false,
                    message: "Gelombang aktif tidak ditemukan",
                }
            };
        }
        const createAlamatResult = await prisma.alamat.create({
            data: {
                alamat: reqbody.alamat.toUpperCase(),
                rt: parseInt(reqbody.rt),
                rw: parseInt(reqbody.rw),
                keldes: reqbody.keldes.toUpperCase(),
                kecamatan: reqbody.kecamatan.toUpperCase(),
                kabkot: reqbody.kabkot.toUpperCase(),
                provinsi: reqbody.provinsi.toUpperCase(),
            }
        });

        const createSiswaResult = await prisma.siswa.create({
            data: {
                nomor: nomor,
                kode: kode,
                nama: reqbody.nama.toUpperCase(),
                jk: reqbody.jk,
                hp: reqbody.hp,
                sekolah: reqbody.sekolah.toUpperCase(),
                alamatId: createAlamatResult.id,
                ip: reqbody.ip.toUpperCase(),
                prejur: reqbody.prejur.toUpperCase(),
                gelombangId: gelombang.id,
            }
        });
        const server = req.headers.host ?? '';

        return {
            status: 200,
            data: {
                success: true,
                server: server,
                datasiswa: createSiswaResult,
                dataalamat: createAlamatResult,
                message: "Data berhasil disimpan",
            }
        };

    } catch (error) {
        const server = req.headers.host ?? '';
        console.log(error)
        return {
            status: 400,
            data: {
                success: false,
                server: server,
                message: "Gagal mendaftar",
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