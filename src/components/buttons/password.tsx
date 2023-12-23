import React, {useState} from 'react';
import Modal from "@/components/modal";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
import {CloseSwal, LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import axios from "axios";

const Password = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");

    const handleUbahClick = async () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleSimpan = async () => {
        setIsModalOpen(false);
        showWaitLoading("Mencoba mengubah password...");
        if (password === "" || password2 === "") {
            LoadingTimer("Password tidak boleh kosong", "error", 1500);
            return;
        }
        if (password !== password2) {
            LoadingTimer("Password tidak sama", "error", 1500);
            return;
        }
        if (password.length < 8) {
            LoadingTimer("Password minimal 8 karakter", "error", 1500);
            return;
        }
        try {
            const {data} = await axios.post("/api/user/edit/password", {
                password: password
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getCookie("token")}`
                }
            });
            if (data.success) {
                LoadingTimer("Berhasil mengubah password", "success", 1500);
            } else {
                LoadingTimer("Gagal mengubah password", "error", 1500);
            }
        } catch (e) {
            console.log(e);
            LoadingTimer("Terjadi kesalahan", "error", 1500);
        }
    }
    return (
        <>
            <button
                className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full m-3"
                onClick={handleUbahClick}
                type={"button"}
            >
                Ubah Password
            </button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h3 className={"text-center mb-3"}>Ubah Password</h3>
                <div className={"card"}>
                    <div className={"card-body"}>
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password baru
                            </label>
                            <input
                                className="text-center appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                type="password"
                                id="password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                placeholder={"Password baru"}/>
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Ulangi Password baru
                            </label>
                            <input
                                className="text-center appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                type="password"
                                id="password"
                                onChange={(e) => {
                                    setPassword2(e.target.value);
                                }}
                                placeholder={"Password baru"}/>
                        </div>
                        <div className="mb-3">
                            <button type="button"
                                    className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full m-3"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        handleSimpan();
                                    }}>
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Password;