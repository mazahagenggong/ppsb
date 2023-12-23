import React from 'react';
import Image from "next/image";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import axios from "axios";
import {getCookie} from "cookies-next";

interface UploadComponentProps {
    data: string|null;
}
const UploadComponent: React.FC<UploadComponentProps> = ({data}) => {
    let panitia: string | null;
    if (!data) {
        panitia = null;
    } else {
        panitia= data;
    }

    const [uploadedImageUrl, setUploadedImageUrl] = React.useState<string | null>(null);
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                setUploadedImageUrl(e.target?.result as string);
            };

            reader.readAsDataURL(file);
        } else {
            setUploadedImageUrl(null);
        }
    };
    const kirimBukti = async () => {
        let gambar: string | null = null;
        if (uploadedImageUrl) {
            console.log("upload gambar")
            showWaitLoading('Mengupload gambar.')
            const formData = new FormData();
            const file = document.getElementById("foto") as HTMLInputElement;
            formData.append("file", file.files?.[0] as Blob);
            formData.append("location", "bukti_pembayaran");
            if (file.files?.[0]) {
                try {
                    const upload = await axios.post('/api/upload', formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    });
                    if (upload.data.success) {
                        await LoadingTimer('Berhasil mengupload gambar.', 'success', 1500);
                        gambar = upload.data.data.public_id ?? null;
                        if (gambar) {
                            SimpanBuktibayar(gambar);
                        }
                    } else {
                        await LoadingTimer('Gagal mengupload gambar.', 'error', 1500);
                        console.log(upload.data.message);
                        return;
                    }
                } catch (e) {
                    await LoadingTimer('Gagal mengupload gambar.', 'error', 1500);
                    console.log(e);
                    return;
                }
            }
        }

    }
    const SimpanBuktibayar = async (gambar: string) => {
        showWaitLoading('Mengirim bukti pembayaran.')
        try {
            let send_data: any = {
                gambar_id: gambar
            };

            if (panitia !== null) {
                send_data.panitia = panitia;
            }

            const save_data = await axios.post('/api/santri/upload_bayar', send_data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getCookie("token_santri")}`
                }
            });
            if (save_data.data.success) {
                await LoadingTimer('Berhasil mengirim bukti pembayaran.', 'success', 1500);
                window.location.reload();
            } else {
                await LoadingTimer('Gagal mengirim bukti pembayaran.', 'error', 1500);
                console.log(save_data.data.message);
                return;
            }
        } catch (e) {
            await LoadingTimer('Gagal mengirim bukti pembayaran.', 'error', 1500);
            console.log(e);
            return;
        }
    }
    return (
        <>
            <center>
                <p className="text-gray-700">Silahkan upload bukti pembayaran</p>
            </center>
            <div className="mb-3">
                <center>
                    {uploadedImageUrl ? (
                        <Image
                            id={"image-preview"}
                            src={uploadedImageUrl}
                            alt="gambar"
                            className={"img-thumbnail"}
                            width="1200"
                            height="900"
                            priority
                            style={{maxWidth: 'auto', height: '400px', width: 'auto'}}
                        />
                    ) : (
                        <Image
                            id={"image-preview"}
                            src={"https://mazainulhasan1.sch.id/LOGO.png"}
                            alt="gambar"
                            className={"img-thumbnail"}
                            width="1200"
                            height="900"
                            priority
                            style={{maxWidth: 'auto', height: '400px', width: 'auto'}}
                        />
                    )}
                </center>
                <input className="form-control my-2" type="file" id="foto" name="foto"
                       onChange={async (e) => {
                           await handleImageUpload(e)
                       }}/>
            </div>
            <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full my-3 md:mx-3"
                    onClick={(e) => {
                        e.preventDefault();
                        kirimBukti();
                    }}
            >
                Kirim Bukti Pembayaran
            </button>
        </>
    );
};

export default UploadComponent;