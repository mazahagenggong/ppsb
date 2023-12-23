import React from 'react';
import Image from "next/image";
import axios from "axios";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import {getCookie} from "cookies-next";
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