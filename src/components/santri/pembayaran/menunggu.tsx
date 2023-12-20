import React from 'react';
import {CldImage} from "next-cloudinary";

const Menunggu = (data:any) => {
    const bukti = data.bukti;
    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold text-gray-700">Anda sudah mengirimkan bukti pembayaran</h1>
            <p className="text-gray-700">Silahkan menunggu verifikasi</p>
            <div className="mb-3">
                <center>

                        <CldImage
                            id={"image-preview"}
                            src={bukti}
                            alt="gambar"
                            className={"img-thumbnail"}
                            width="1200"
                            height="900"
                            priority
                            style={{maxWidth: 'auto', height: '400px', width: 'auto'}}
                        />
                    <h1 className="text-2xl font-bold text-gray-700 m-3">Status : Menunggu Verifikasi</h1>
                    <div className="alert alert-warning" role="alert">
                        <strong>Perhatian!</strong> Jika ada kesalahan dalam upload bukti pembayaran silahkan hubungi panitia PSB.
                    </div>
                </center>
            </div>
        </div>
    );
};

export default Menunggu;