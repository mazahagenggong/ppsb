import type {NextApiRequest, NextApiResponse} from 'next'
import cloudinary from "@/utils/cloud";
import formidable from 'formidable';
import {Panitia, Santri} from "@/utils/validate/token";


export const config = {
    api: {
        bodyParser: false,
    },
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token_santri = req.cookies.token_santri;
    const token_panitia = req.cookies.token;
    if (!token_santri || token_santri === "") {
        if (!token_panitia || token_panitia === "") {
            res.status(401).json({error: 'Unauthorized'});
            return;
        } else {
            const cek_token_panitia = await Panitia(token_panitia);
            if (!cek_token_panitia.success) {
                return res.status(401).json({
                    success: false,
                    message: cek_token_panitia.message,
                });
            }
        }
    } else {
        const cek_token_santri = await Santri(token_santri);
        if (!cek_token_santri.success) {
            return res.status(401).json({
                success: false,
                message: cek_token_santri.message,
            });
        }
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
                            resource_type: 'image',
                            allowed_formats: ['jpg', 'png', 'jpeg'],
                        });
                    res.status(200).json({success: true, data: upload});
                } catch (error) {
                    res.status(500).json({success: false, error: error});
                }
            }
        });
    } else {
        res.status(400).json({methode: req.method})
    }
}
