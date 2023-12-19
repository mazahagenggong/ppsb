import type {NextApiRequest, NextApiResponse} from 'next'
import cloudinary from "@/utils/cloud";
import formidable from 'formidable';
import jwt from "jsonwebtoken";
import prisma from "@/utils/prisma";
import {Santri} from "@/utils/validate/token";

export const config = {
    api: {
        bodyParser: false,
    },
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token_santri;
    if (!token || token === "") {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }
    const cek_token = await Santri(token);

    if (!cek_token.success) {
        return res.status(401).json({
            success: false,
            message: cek_token.message,
        });
    }
    if (req.method === 'POST') {
        const form = formidable();
        form.parse(req, async (err: any, fields: any, files: any) => {
            if (err) {
                console.error('Error parsing form:', err);
                res.status(500).json({error: 'Internal server error'});
            } else {
                if (!fields.location) {
                    res.status(400).json({error: 'Lokasi harus diisi'});
                    return;
                }
                if (!files.file?.[0]) {
                    res.status(400).json({error: 'No file uploaded'});
                    return;
                }
                try {
                    const upload = await cloudinary.v2.uploader
                        .upload(files.file?.[0].filepath, {
                            folder: `psb/${fields.location}`,
                            resource_type: 'image'
                        });
                    res.status(200).json({success: true, data: upload});
                } catch (error) {
                    console.error(error);
                    res.status(500).json({success: false, error: 'Internal server error, koneksi ke cloudinary gagal'});
                }
            }
        });
    } else {
        res.status(400).json({methode: req.method})
    }
}
