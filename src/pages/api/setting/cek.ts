import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from "cors";
import runMiddleware from "@/utils/runMiddleware";
import {promises as fs} from 'fs';

const getdata = async function (req: NextApiRequest) {
    const file = await fs.readFile(process.cwd() + '/src/utils/config/setting.json', 'utf8');
    const data = JSON.parse(file);
    return {
        status: 200,
        data: {
            success: true,
            data: data,
            message: "berhasil"
        }
    };
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
