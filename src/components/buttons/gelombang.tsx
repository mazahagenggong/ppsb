import React, {ChangeEvent, useState} from 'react';
import Modal from "@/components/modal";
import Datepicker from "react-tailwindcss-datepicker";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import moment from 'moment';
import 'moment/locale/id';
import axios from "axios";
import {getCookie} from "cookies-next";

moment.locale('id');

type GelombangProps = {
    onMutate: () => void;
};

const Gelombang : React.FC<GelombangProps> = ({ onMutate }) => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [nama, setNama] = useState<string | null>(null);
    const [periode, setPeriode] = useState<string | null>(null);
    const [durasi, setDurasi] = useState<any>({
        startDate: new Date(),
        endDate: new Date()
    });
    const [biayaPendaftaran, setBiayaPendaftaran] = useState<number | string>('');

    const handleBiayaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Hapus karakter selain digit
        const parsedValue = parseInt(value, 10);

        if (!isNaN(parsedValue)) {
            const formattedValue = formatToRupiah(parsedValue);
            setBiayaPendaftaran(formattedValue);
        } else {
            setBiayaPendaftaran('');
        }
    };

    const handleValueChange = (tanggal: any) => {
        setDurasi(tanggal);
    }


    const handleGelombangClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <button
                className="btn btn-primary w-full md:w-auto md:ml-3 mt-3 md:mt-0 justify-center"
                onClick={handleGelombangClick}
            >Tambah
                Gelombang
            </button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className={"max-h-[80vh] overflow-y-auto"}>
                    <h3 className={"text-center mb-3"}>Tambah Gelombang</h3>
                    <div className={"p-4"}>
                        <form className="w-full max-w-full mb-3">
                            <div className="flex flex-wrap flex-col -mx-3 mb-6">
                                <div className="md:mb-0">
                                    <div className="flex flex-col w-full">
                                        <label
                                            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="nama">
                                            Nama Gelombang
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            id="nama"
                                            name={"nama"}
                                            type="text"
                                            placeholder={"Nama"}
                                            onChange={(e) => {
                                                if (!e.target.value) {
                                                    setNama(null);
                                                } else {
                                                    setNama(e.target.value);
                                                }
                                            }}/>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label
                                            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
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
                                        <label
                                            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="nama">
                                            Periode Pendaftaran
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            id="periode"
                                            name={"periode"}
                                            type="text"
                                            placeholder={`${currentYear} - ${nextYear}`}
                                            onChange={(e) => {
                                                if (!e.target.value) {
                                                    setPeriode(null);
                                                } else {
                                                    setPeriode(e.target.value);
                                                }
                                            }}/>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label
                                            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="nama">
                                            Biaya Pendaftaran
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            id="biayaPendaftaran"
                                            name="biayaPendaftaran"
                                            type="text"
                                            placeholder="Biaya Pendaftaran"
                                            value={biayaPendaftaran}
                                            onChange={handleBiayaChange}
                                        />
                                    </div>
                                    <center>
                                        <button
                                            className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full my-1 md:mx-3"
                                            type="submit"
                                            onClick={
                                                async (e) => {
                                                    e.preventDefault();
                                                    if (nama === null) {
                                                        LoadingTimer("Nama gelombang tidak boleh kosong", "error", 1500);
                                                        return;
                                                    }
                                                    if (durasi.startDate === null || durasi.endDate === null) {
                                                        LoadingTimer("Durasi gelombang tidak boleh kosong", "error", 1500);
                                                        return;
                                                    }
                                                    if (periode === null) {
                                                        LoadingTimer("Periode gelombang tidak boleh kosong", "error", 1500);
                                                        return;
                                                    }
                                                    if (biayaPendaftaran === '') {
                                                        LoadingTimer("Biaya pendaftaran tidak boleh kosong", "error", 1500);
                                                        return;
                                                    }
                                                    const data = {
                                                        nama: nama,
                                                        durasi: moment(durasi.startDate).format('DD MMMM YYYY') + " - " + moment(durasi.endDate).format('DD MMMM YYYY'),
                                                        periode: periode,
                                                        biayaPendaftaran: biayaPendaftaran
                                                    }
                                                    showWaitLoading("Menambahkan gelombang")
                                                    try {
                                                        const {data: new_data} = await axios.post("/api/gelombang/tambah", data, {
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': 'Bearer ' + getCookie('token')
                                                            }

                                                        });
                                                        console.log(new_data)
                                                        if (new_data.success) {
                                                            LoadingTimer("Berhasil menambahkan gelombang", "success", 1500);
                                                            onMutate();
                                                            handleCloseModal();
                                                        }
                                                    } catch (e) {
                                                        console.log(e)
                                                        LoadingTimer("gagal menambahkan gelombang", "error", 1500);
                                                        handleCloseModal();
                                                    }
                                                }
                                            }>
                                            Tambah Gelombang
                                        </button>
                                    </center>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    )
        ;
};
const formatToRupiah = (value: number): string => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });
    return formatter.format(value);
};
export default Gelombang;