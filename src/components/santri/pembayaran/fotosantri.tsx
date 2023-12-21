import React from 'react';
import Image from "next/image";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import axios from "axios";
import {getCookie} from "cookies-next";

const Fotosantri = () => {
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
    const UploadFoto = async () => {
        let gambar: string | null = null;
        if (uploadedImageUrl) {
            showWaitLoading('Mengupload foto.')
            const formData = new FormData();
            const file = document.getElementById("foto") as HTMLInputElement;
            formData.append("file", file.files?.[0] as Blob);
            formData.append("location", "foto_santri");
            if (file.files?.[0]) {
                try {
                    const upload = await axios.post('/api/upload', formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    });
                    if (upload.data.success) {
                        await LoadingTimer('Berhasil mengupload foto.', 'success', 1500);
                        gambar = upload.data.data.public_id ?? null;
                        if (gambar) {
                            SimpanFoto(gambar);
                        }
                    } else {
                        await LoadingTimer('Gagal mengupload foto.', 'error', 1500);
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
    const SimpanFoto = async (gambar: string) => {
        showWaitLoading('Menyimpan foto.')
        try {
            const save_data = await axios.post('/api/santri/upload_foto', {
                gambar_id: gambar
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getCookie("token_santri")}`
                }
            });
            if (save_data.data.success) {
                await LoadingTimer('Berhasil menyimpan foto.', 'success', 1500);
                window.location.reload();
            } else {
                await LoadingTimer('Gagal menyimpan foto.', 'error', 1500);
                console.log(save_data.data.message);
                return;
            }
        } catch (e) {
            await LoadingTimer('Gagal menyimpan foto.', 'error', 1500);
            console.log(e);
            return;
        }
    }
    return (
        <div className="flex flex-col mb-3">
            <div className="alert alert-success text-center mb-3" role="alert">
                Biodata telah disimpan <br/><strong>Silahkan upload foto anda
                ini</strong>
            </div>
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
            <button
                className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full my-3 md:mx-3"
                onClick={(e) => {
                    e.preventDefault();
                    UploadFoto();
                }}
            >
                Upload Foto
            </button>
        </div>
    );
};

export default Fotosantri;