import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import prisma from "@/utils/prisma"
import runMiddleware from "@/utils/runMiddleware"
import {Santri} from "@/utils/validate/token";

const post = async function (req: NextApiRequest) {
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
   const validate = await Santri(token);
    if (!validate.success) {
        return {
            status: 401,
            data: {
                success: false,
                message: validate.message,
            }
        };
    }

    if (!req.body) {
        return {
            status: 400,
            data: {
                success: false,
                message: "body tidak ada",
            }
        };
    }
    const body = req.body;
    const data = {
        tempat_lahir: body.tempat_lahir,
        tanggal_lahir: new Date(body.tanggal_lahir),
        nisn: body.nisn,
        nik: body.nik,
        kip: body.kip === 'ya' ? true : false,
        jurusan: body.jurusan,
        jumlah_saudara: parseInt(body.jumlah_saudara),
        anak_ke: parseInt(body.anak_ke),
        npsn: body.npsn,
        alamat_sekolah: body.alamat_sekolah,
        nama_ayah: body.nama_ayah,
        nik_ayah: body.nik_ayah,
        pekerjaan_ayah: body.pekerjaan_ayah,
        pendidikan_ayah: body.pendidikan_ayah,
        nama_ibu: body.nama_ibu,
        nik_ibu: body.nik_ibu,
        pekerjaan_ibu: body.pekerjaan_ibu,
        pendidikan_ibu: body.pendidikan_ibu,
    }
    const santri_id = validate?.data?.id;
    if (!santri_id) {
        return {
            status: 401,
            data: {
                success: false,
                message: "user tidak ditemukan",
            }
        };
    }
    try {
        try {
            const ceksiswa = await prisma.siswa.findUnique({
                where: {id: santri_id},
                include: {
                    biodata: true,
                }
            })
            if (!ceksiswa) {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: "Data tidak ditemukan",
                    }
                };
            }
            if (ceksiswa.biodata) {
                await prisma.siswa.update({
                    where: {id: santri_id},
                    data: {
                        biodata: {
                            update: data
                        }
                    }
                });
            } else {
                const bio = await prisma.biodata_tambahan.create({
                    data: data
                });
                if (!bio) {
                    return {
                        status: 401,
                        data: {
                            success: false,
                            message: "Gagal mengupdate data",
                        }
                    };
                }
                const santri = await prisma.siswa.update({
                    where: {id: santri_id},
                    data: {
                        biodataId: bio.id
                    }
                });
                if (!santri) {
                    return {
                        status: 401,
                        data: {
                            success: false,
                            message: "Gagal mengupdate data",
                        }
                    };
                }
            }
            return {
                status: 200,
                data: {
                    success: true,
                    message: "berhasil mengubah data",
                    data: body
                }
            };
        } catch (e) {
            console.log(e)
            return {
                status: 400,
                data: {
                    success: false,
                    message: "gagal mengupdate data santri",
                }
            };
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