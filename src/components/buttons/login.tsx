import React, {useState, useEffect} from 'react';
import Modal from '@/components/modal/default';
import {CloseSwal, LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import axios from "axios";
import {deleteCookie, getCookie, setCookie} from "cookies-next";

const Login: React.FC = () => {
    const [kode, setKode] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleLoginClick = async () => {
        const token = getCookie("token_santri");
        if (!token || token === "") {
            deleteCookie("token_santri");
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
            showWaitLoading("Mencoba login...");
            try {
                const {data} = await axios.post("/api/auth/santri/detail", {}, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (data.success) {
                    await LoadingTimer("Login berhasil", "success", 1500);
                    setCookie("token_santri", data.data.token);
                    window.location.href = "/santri";
                } else {
                    deleteCookie("token_santri");
                    CloseSwal();
                    setIsModalOpen(true);
                }
            } catch (e) {
                deleteCookie("token_santri");
                CloseSwal();
                setIsModalOpen(true);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleLogin = async () => {
        setIsModalOpen(false);
        if (kode === "") {
            LoadingTimer("Kode Login tidak boleh kosong", "error", 1500);
        }
        showWaitLoading("Mencoba login...");
        try {
            const {data} = await axios.post("/api/auth/santri", {
                kode: kode
            });
            if (data.success) {
                LoadingTimer("Login berhasil", "success", 1500);
                setCookie("token_santri", data.data.token);
                window.location.href = "/santri";
            } else {
                await LoadingTimer("Kode Login salah", "error", 1500);
                setIsModalOpen(true);
            }
        } catch (e) {
            await LoadingTimer("Kode Login salah", "error", 1500);
            setIsModalOpen(true);
        }
    }

    return (
        <>
            <button
                className="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded-full my-3 md:mx-3"
                onClick={handleLoginClick}
            >
                Login
            </button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h3 className={"text-center mb-3"}>Login</h3>
                <form className="w-full max-w-full mb-3">
                    <div className="flex flex-wrap flex-col -mx-3 mb-6">
                        <div className="md:mb-0">
                            <input
                                className="text-center appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                id="kode"
                                type="text"
                                placeholder={"Kode Login"}
                            onChange={(e)=> {
                                setKode(e.target.value)
                            }}/>
                            <center>
                                <button
                                    className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-full my-1 md:mx-3"
                                    type="submit"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        handleLogin();
                                    }}>
                                    Login
                                </button>
                            </center>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default Login;