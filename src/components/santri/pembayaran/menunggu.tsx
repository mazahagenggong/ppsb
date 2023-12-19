import React from 'react';
import {CldImage} from "next-cloudinary";

const Menunggu = ({bukti} ) => {
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
                    <p className={"italic"}>Jika ada kesalahan upload bukti pembayaran silahkan hubungi panitia PSB</p>
                </center>
            </div>
        </div>
    );
};

export default Menunggu;