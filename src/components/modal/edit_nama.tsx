import React, {useState} from 'react';
import Modal from "@/components/modal/default";
import {useModalEditNamaStore} from "@/utils/stores/modalEditNama";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import axios from "axios";
import {getCookie} from "cookies-next";

export const EditNamaTD = (data: any) => {
    const {setModalNama} = useModalEditNamaStore();
    const santri = data.data;

    const handleNamaClick = () => {
        setModalNama(true);
    };
    return (
        <tr className={"cursor-pointer"} onClick={() => handleNamaClick()}>
            <td>Nama Lengkap</td>
            <td>{santri.nama.toUpperCase()}</td>
        </tr>
    );
};

export const EditNamaModal = ({ data, mutate }: { data: any, mutate: any }) => {
    const santri = data;
    const {modalNama,setModalNama} = useModalEditNamaStore();
    const [nama, setNama] = useState<string>(santri.nama ?? '')
    const handleCloseModal = () => {
        setModalNama(false);
    };

    const handleNamaClick = () => {
        setModalNama(true);
    };

    const handleEdit = async () =>{
        if (nama === ""){
            LoadingTimer("Nama santri harus di isi", "error", 3000)
            return;
        }
        const id = santri.id;
        setModalNama(false);
        showWaitLoading("Mengubah nama santri...")
        try {
            await axios.post("/api/santri/biodata/nama",
                {id,nama},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getCookie('token') || '',
                    }
                })
            mutate();
            LoadingTimer("Berhasil mengubah nama santri", "success", 3000)
        } catch (e){
            console.log(e)
            LoadingTimer("Gagal ubah mengubah santri", "error", 3000)
        }
    }
    return (
        <>
            <Modal isOpen={modalNama} onClose={handleCloseModal}>
                <h3 className={"text-center mb-3"}>Edit Nama</h3>
                <form className="w-full max-w-full mb-3">
                    <div className="flex flex-wrap flex-col -mx-3 mb-6">
                        <div className="md:mb-0">
                            <input
                                className="text-center appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                id="kode"
                                type="text"
                                value={nama}
                                onChange={(e)=> {
                                    setNama(e.target.value ?? "")
                                }}
                                placeholder={"Nama Baru"}/>
                            <center>
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full my-1 md:mx-3"
                                    type="submit"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        handleEdit();
                                    }}>
                                    Edit
                                </button>
                            </center>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};