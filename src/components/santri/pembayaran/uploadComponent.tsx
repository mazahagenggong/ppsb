import React, {useState} from 'react';
import Image from "next/image";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import axios from "axios";
import {getCookie} from "cookies-next";

interface UploadComponentProps {
    data: string | null;
    santri: any;
}

const UploadComponent: React.FC<UploadComponentProps> = ({data, santri}) => {
    const [jalur, setJalur] = useState<string>("")
    const [prestasi, setPrestasi] = useState<string>("")
    let panitia: string | null;
    if (!data) {
        panitia = null;
    } else {
        panitia = data;
    }
    let snt: any;
    if (!santri) {
        snt = null;
    } else {
        snt = santri;
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
        if (!jalur || jalur === "") {
            await LoadingTimer('Jalur pendaftaran belum di pilih.', 'error', 1500);
            return;
        }
        if (jalur && prestasi === "") {
            await LoadingTimer('Prestasi belum di pilih.', 'error', 1500);
            return;
        }
        let gambar: string | null = null;
        if (uploadedImageUrl) {
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
                        return;
                    }
                } catch (e: any) {
                    console.log("error upload")
                    await LoadingTimer('Gagal mengupload gambar. <br/>' + e?.response?.data?.error?.message ?? e.messege, 'error', 3000);
                    return;
                }
            }
        }

    }
    const SimpanBuktibayar = async (gambar: string) => {
        showWaitLoading('Mengirim bukti pembayaran.')
        try {
            let send_data: any = {
                gambar_id: gambar,
            };

            if (jalur !== "" && prestasi !== ""){
                send_data.jalur = jalur
                send_data.prestasi = prestasi
            }

            if (panitia !== null) {
                send_data.panitia = panitia;
                const login = await axios.post('/api/auth/santri', {
                    kode: snt.kode
                });
                const token = login.data.data.token;
                const save_data = await axios.post('/api/santri/upload_bayar', send_data, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (save_data.data.success) {
                    await LoadingTimer('Berhasil mengirim bukti pembayaran.', 'success', 1500);
                    window.location.reload();
                } else {
                    console.log(save_data.data)
                    await LoadingTimer('Gagal mengirim bukti pembayaran.', 'error', 1500);
                    return;
                }
            } else {
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
                    return;
                }
            }
        } catch (e) {
            console.log(e)
            await LoadingTimer('Gagal mengirim bukti pembayaran.', 'error', 1500);
            return;
        }
    }
    return (
        <>
            <div className="w-full max-w-full">
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className={`w-full ${jalur === "bayar" ? "md:w-full" : "md:w-1/2"} px-3 md:mb-0`}>
                        <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="jalur">
                            Jalur pendaftaran
                        </label>
                        <div>
                            <select
                                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                id="jalur" onChange={(e) => setJalur(e.target.value)}
                                required={true}>
                                <option value="">-- Pilih --</option>
                                <option value="bayar">Berbayar</option>
                                <option value="prestasi">Prestasi</option>
                            </select>
                            <div
                                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 20 20">
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    {jalur === "prestasi" && (
                        <div className="w-full md:w-1/2 px-3 md:mb-0">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="prestasi">
                                Jenis Prestasi
                            </label>
                            <div>
                                <select
                                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                    id="prestasi" onChange={(e) => setPrestasi(e.target.value)}
                                    required={true}>
                                    <option value="">-- Pilih --</option>
                                    <option value="tahfidz">Tahfidz 5 juz</option>
                                    <option value="alfiyah">Alfiyah 500 Bait</option>
                                    <option value="porseni">Juara 1-3 Porseni Kabupaten</option>
                                    <option value="peringkat_kelas">Peringkat 1 di kelas 9</option>
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 20 20">
                                        <path
                                            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={"flex flex-col"}>
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor={"foto"}
                    >
                        Silahkan upload bukti {jalur === "bayar" ? "Pembayaran" : "Prestasi"}
                    </label>
                    <div className="mb-3">
                        <input className="form-control my-2" type="file" id="foto" name="foto"
                               onChange={async (e) => {
                                   await handleImageUpload(e)
                               }}/>
                    </div>
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
                    <button
                        className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full my-3 md:mx-3"
                        onClick={(e) => {
                            e.preventDefault();
                            kirimBukti();
                        }}
                    >
                        Kirim Bukti {jalur === "bayar" ? "Pembayaran" : "Prestasi"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default UploadComponent;