import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"

const post = async function (req: NextApiRequest) {
    const reqbody = req.body;
    const cek = await prisma.siswa.count({});
    const kode = (202400001 + cek).toString();

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
                kode: kode,
                nama: reqbody.nama,
                jk: reqbody.jk,
                hp: reqbody.hp,
                sekolah: reqbody.sekolah,
                alamatId: createAlamatResult.id,  // Gunakan id alamat yang baru saja dibuat
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
                message: "Data gagal disimpan",
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