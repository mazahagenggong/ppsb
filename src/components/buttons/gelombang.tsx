import React, {useState} from 'react';
import Modal from "@/components/modal";
import Datepicker from "react-tailwindcss-datepicker";

const Gelombang = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [durasi, setDurasi] = useState<any>({
        startDate: new Date(),
        endDate: new Date()
    });

    const handleValueChange = (tanggalmulai: any) => {
        console.log("tanggalmulai:", tanggalmulai);
        setDurasi(tanggalmulai);
    }


    const handleLoginClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <button
                className="btn btn-primary w-full md:w-auto md:ml-3 mt-3 md:mt-0 justify-center"
                onClick={handleLoginClick}
            >Tambah
                Gelombang
            </button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h3 className={"text-center mb-3"}>Login</h3>
                <form className="w-full max-w-full mb-3">
                    <div className="flex flex-wrap flex-col -mx-3 mb-6">
                        <div className="md:mb-0">
                            <div className="flex flex-col w-full">
                                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                                       htmlFor="nama">
                                    Nama Gelombang
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="nama"
                                    name={"nama"}
                                    type="text"
                                    placeholder={"Nama"}/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                                       htmlFor="nama">
                                    Durasi Gelombang
                                </label>
                                <Datepicker
                                    primaryColor={"green"}
                                    value={durasi}
                                    onChange={handleValueChange}
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                                       htmlFor="nama">
                                    Nama Gelombang
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="nama"
                                    name={"nama"}
                                    type="text"
                                    placeholder={"Nama"}/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                                       htmlFor="nama">
                                    Nama Gelombang
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="nama"
                                    name={"nama"}
                                    type="text"
                                    placeholder={"Nama"}/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                                       htmlFor="nama">
                                    Nama Gelombang
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="nama"
                                    name={"nama"}
                                    type="text"
                                    placeholder={"Nama"}/>
                            </div>
                            <center>
                                <button
                                    className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-full my-1 md:mx-3"
                                    type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log("Login");
                                    }}>
                                    Login
                                </button>
                            </center>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    )
        ;
};

export default Gelombang;