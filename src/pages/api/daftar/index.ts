import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"
import {Origin} from "@/utils/validate/origin";
import moment from "moment";
import {KirimPribadi, KirimSekret, KirimUtama, Pesan} from "@/utils/telegram/chat";

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
        const cek_ganda = await prisma.siswa.findFirst({
            where: {
                nama: reqbody.nama.toUpperCase(),
                hp: reqbody.hp,
            },
        });
        if (cek_ganda) {
            return {
                status: 400,
                data: {
                    success: false,
                    message: "Data sudah pernah didaftarkan",
                }
            };
        }
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
                alamat: reqbody.alamat.toUpperCase().trim(),
                rt: parseInt(reqbody.rt),
                rw: parseInt(reqbody.rw),
                keldes: reqbody.keldes.toUpperCase().trim(),
                kecamatan: reqbody.kecamatan.toUpperCase().trim(),
                kabkot: reqbody.kabkot.toUpperCase().trim(),
                provinsi: reqbody.provinsi.toUpperCase().trim(),
            }
        });

        const createSiswaResult = await prisma.siswa.create({
            data: {
                nomor: nomor,
                kode: kode,
                nama: reqbody.nama.toUpperCase().trim(),
                jk: reqbody.jk,
                hp: reqbody.hp,
                sekolah: reqbody.sekolah.toUpperCase().trim(),
                alamatId: createAlamatResult.id,
                ip: reqbody.ip.toUpperCase().trim(),
                prejur: reqbody.prejur.toUpperCase().trim(),
                gelombangId: gelombang.id,
            }
        });
        const server = req.headers.host ?? '';
        const date = moment().format('DD-MM-YYYY');

        try {
            let pesan = `Nama : ${createSiswaResult?.nama}\n`;
            pesan = pesan + `Nomor Pendaftaran : ${createSiswaResult?.nomor}\n`;
            pesan = pesan + `Kode Login : ${createSiswaResult?.kode}\n`;
            pesan = pesan + `Jenis Kelamin : ${createSiswaResult?.jk === "lk" ? "Laki - Laki" : "Perempuan"}\n`;
            pesan = pesan + `Pilihan Jurusan : ${createSiswaResult?.prejur}\n`;
            pesan = pesan + `Sekolah Asal : ${createSiswaResult?.sekolah}\n`;
            pesan = pesan + `Informasi Pendaftaran : ${createSiswaResult?.ip}\n`;
            pesan = pesan + `Nomor HP : ${createSiswaResult?.hp}\n`;
            pesan = pesan + `Alamat : ${createAlamatResult?.alamat} RT ${createAlamatResult?.rt} RW ${createAlamatResult?.rw} - ${createAlamatResult?.keldes},  ${createAlamatResult?.kecamatan}  - ${createAlamatResult?.kabkot} - ${createAlamatResult?.provinsi}\n`;
            pesan = pesan + `Waktu Pendaftaran : ${formatDate(createSiswaResult?.created_at ?? null)}\n`;
            pesan = pesan + `Gelombang Pendaftaran: ${gelombang.nama}\n`;
            pesan = pesan + `Biaya Pendaftaran : ${gelombang.biaya}\n`;
            pesan = pesan + `Telah melakukan pendaftaran pada tanggal ${date}\n`;
            pesan = await Pesan({
                pesan: pesan,
                pengirim: server,
                waktu: date,
            })
            await Promise.all([
                KirimUtama(pesan),
                KirimSekret(pesan),
            ]);
        } catch (e) {
            const pesan = `dari psb: \n${JSON.stringify(e)}`;
            await KirimPribadi(pesan);
            console.log(`Error sending message :`, e);
        }

        return {
            status: 200,
            data: {
                success: true,
                datasiswa: createSiswaResult,
                dataalamat: createAlamatResult,
                message: "Data berhasil disimpan",
            }
        };

    } catch (error) {
        console.log(error)
        return {
            status: 400,
            data: {
                success: false,
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