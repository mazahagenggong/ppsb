import React, {useEffect, useState} from 'react';
import Modal from "@/components/modal/scroll";
import FormulirSantri from "@/components/santri/formulir";
import axios from "axios";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import createFormulirPDF from "@/utils/createFormulirPDF";

interface BiodataComponentProps {
    name: string;
    santri: any;
}

const Biodata: React.FC<BiodataComponentProps> = ({name, santri}) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const handleBiodataClick = async () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleDownload = async (e: any) => {
        e.preventDefault();
        try {
            showWaitLoading("Membuat formulir pendaftaran.")
            const {data} = (await axios.post("/api/cek/siswa", {id: santri.id})).data;
            console.log(data);

            await createFormulirPDF(data);
            await LoadingTimer("Formulir pendaftaran berhasil di buat.", "success", 3000);
        } catch (e) {
            console.log(e);
            await LoadingTimer("Formulir pendaftaran gagal di buat.", "error", 3000);
        }
    };
    useEffect(() => {
        const cekToken = async () => {
            const login = await axios.post('/api/auth/santri', {
                kode: santri.kode
            });
            const token = login.data.data.token;
            setToken(token);
        }
        cekToken();
    }, [santri]);

    return (
        <>
            <div className={"m-3"}>
                <center>
                    <button
                        className={"bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full m-3 md:mx-3"}
                        onClick={handleBiodataClick}
                        type={"button"}>{name}
                    </button>
                    {santri.biodata && (
                        <button
                            className={"bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full m-3 md:mx-3"}
                            onClick={handleDownload}
                            type={"button"}>Download Formulir
                        </button>
                    )}
                </center>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h3 className={"text-center mb-3"}>{name}</h3>
                <FormulirSantri data={santri} token={token} modal={setIsModalOpen}/>
            </Modal>
        </>
    );
};

export default Biodata;