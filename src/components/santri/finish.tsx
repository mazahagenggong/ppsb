import React from "react";
import {CldImage} from "next-cloudinary";
import {
    LoadingTimer,
    showWaitLoading,
} from "@/components/loading/waitLoading";
import createFormulirPDF from "@/utils/createFormulirPDF";
import moment from "moment";
import "moment/locale/id";
import axios from "axios";
import Formulir from "@/components/card/formulir";

moment.locale("id");

const Finish = (data: any) => {
    const {data: dataSantri} = data;
    const handleDownload = async (e: any) => {
        e.preventDefault();
        try {
            showWaitLoading("Membuat formulir pendaftaran.")
            const {data} = (await axios.post("/api/cek/siswa", {id: dataSantri.id})).data;
            console.log(data);

            await createFormulirPDF(data);
            await LoadingTimer("Formulir pendaftaran berhasil di buat.", "success", 3000);
        } catch (e) {
            console.log(e);
            await LoadingTimer("Formulir pendaftaran gagal di buat.", "error", 3000);
        }
    };
    return (
        <>
            <div className="row">
                <center>
                    <div className="flex-col">
                        <div className="card w-full">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div
                                            className="alert alert-success text-center mb-3"
                                            role="alert"
                                        >
                                            <strong>Selamat anda sudah terdaftar di PSB 2024</strong>
                                        </div>
                                        <button
                                            className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full my-3 md:mx-3"
                                            onClick={(e: any) => {
                                                handleDownload(e);
                                            }}
                                        >
                                            Download Formulir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Formulir data={dataSantri} />
                    </div>
                </center>
            </div>
        </>
    );
};

export default Finish;
