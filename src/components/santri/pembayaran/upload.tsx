import React from 'react';
import UploadComponent from "@/components/santri/pembayaran/uploadComponent";

const Upload = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold text-gray-700">Anda belum melakukan pembayaran</h1>
            <UploadComponent data={null}/>
        </div>
    );
};

export default Upload;