import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"

const generateRandomCode = async (): Promise<string> => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString().slice(0, 6);
    const existingSiswa = await prisma.siswa.findUnique({
        where: { kode: randomCode },
    });

    if (existingSiswa) {
        return generateRandomCode();
    }

    return randomCode;
};

const generatenomoreg = async (): Promise<string> => {
    const currentYear = new Date().getFullYear();

    const lastRegisteredNomor = await prisma.siswa.findFirst({
        orderBy: { nomor: 'desc' },
    });

    let totalSiswa = lastRegisteredNomor ? parseInt(lastRegisteredNomor.nomor.slice(4)) + 1 : 1;

    if (!lastRegisteredNomor && totalSiswa === 1) {
        totalSiswa = 0;
    }
    const nomorReg = `${currentYear}${totalSiswa.toString().padStart(4, '0')}`;

    return nomorReg;
}

const post = async function (req: NextApiRequest) {
    const reqbody = req.body;
    const kode = await generateRandomCode();
    const nomor = await generatenomoreg();

    try {
        const createAlamatResult = await prisma.alamat.create({
            data: {
                alamat: reqbody.alamat,
                rt: parseInt(reqbody.rt),
                rw: parseInt(reqbody.rw),
                keldes: reqbody.keldes,
                kecamatan: reqbody.kecamatan,
                kabkot: reqbody.kabkot,
                provinsi: reqbody.provinsi,
            }
        });

        const createSiswaResult = await prisma.siswa.create({
            data: {
                nomor: nomor,
                kode: kode,
                nama: reqbody.nama,
                jk: reqbody.jk,
                hp: reqbody.hp,
                sekolah: reqbody.sekolah,
                alamatId: createAlamatResult.id,
                ip: reqbody.ip,
            }
        });

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
        return {
            status: 400,
            data: {
                success: false,
                message: "Gagal mendaftar",
                error: error instanceof Error ? error.message : "Unknown error",
            }
        };
    } finally {
        // Always disconnect from the Prisma client to release resources
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