import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from "cors";
import runMiddleware from "@/utils/runMiddleware";
import {promises as fs} from 'fs';
import {Admin} from "@/utils/validate/token";

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
    const verified = await Admin(token);
    if (!verified.success) {
        return {
            status: 401,
            data: {
                success: false,
                message: verified.message,
            }
        };
    }
    const path = process.cwd() + '/src/utils/config/setting.json';
    const body = req.body;
    if (!body.status_pendaftaran) {
        return {
            status: 400,
            data: {
                success: false,
                data: null,
                message: "status pendaftaran tidak boleh kosong"
            }
        };
    }

    try {
        const fileContent = await fs.readFile(path, 'utf-8');
        const settings = JSON.parse(fileContent);
        settings.status_pendaftaran = body.status_pendaftaran;
        await fs.writeFile(path, JSON.stringify(settings, null, 2), 'utf-8');
        const file = await fs.readFile(path, 'utf8');
        const data = JSON.parse(file);
        return {
            status: 200,
            data: {
                success: true,
                data: data,
                message: "berhasil"
            }
        };
    } catch (error) {
        const file = await fs.readFile(path, 'utf8');
        const data = JSON.parse(file);
        return {
            status: 200,
            data: {
                success: true,
                data: error,
                message: "gagal"
            }
        };
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
