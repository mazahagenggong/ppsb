import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import prisma from "@/utils/prisma";
import {Panitia} from "@/utils/validate/token";

const postdata = async function (req: NextApiRequest) {
    // const token = req.headers.authorization?.split(' ')[1];
    // if (!token) {
    //     return {
    //         status: 401,
    //         data: {
    //             success: false,
    //             message: "token tidak ada",
    //         }
    //     };
    // }
    // const cek_token = await Panitia(token);
    // if (!cek_token.success) {
    //     return {
    //         status: 401,
    //         data: {
    //             success: false,
    //             message: cek_token.message,
    //         }
    //     };
    // }
    try {
        const panitiaRegistrations = await prisma.$runCommandRaw({
            aggregate: "siswa",
            pipeline: [
                {
                    $group: {
                        _id: "$panitiaId",
                        total: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "user",
                        localField: "_id",
                        foreignField: "_id",
                        as: "panitia"
                    }
                },
                {
                    $unwind: {
                        path: "$panitia",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        IDpanitia: "$_id",
                        namapanitia: "$panitia.nama",
                        total: 1
                    }
                },
                {
                    $sort: {
                        total: -1
                    }
                }
            ],
            cursor: {}
        });

        const selfRegistrations = await prisma.siswa.count({
            where: {
                OR: [
                    {panitia: null},
                    {panitiaId: null},
                ],
            },
        });
        // return {
        //     status: 200,
        //     data: {panitiaRegistrations}
        // }
        return {
            status: 200,
            data: {page:"test panitia"}
        }
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