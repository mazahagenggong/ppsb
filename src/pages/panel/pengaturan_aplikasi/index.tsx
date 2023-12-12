import React, {useEffect, useState} from 'react';
import Template from "@/components/template/admin/template";
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import PanelContent from "@/components/panelContent";
import useSWR from "swr";
import axios from "axios";
import {getCookie} from "cookies-next";

const fetcher = async (url: string) => axios.get(url).then((res) => res.data);
const Index = () => {
    const {setActive, setShow} = useSidebarPanel();
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const {data:cek, isLoading, error, mutate} = useSWR('/api/setting/cek', fetcher);

    const handleCheckboxChange = async() => {
        try {
            await axios.post('/api/setting/ubah_status', {
                status_pendaftaran: isChecked ? "tutup" : "buka"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getCookie('token') || '',
                }
            });

            mutate();
            setIsChecked(cek?.data?.status_pendaftaran !== "buka");
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        setActive('pengaturan_aplikasi');
        setShow("pengaturan");

        if (cek?.data) {
            const new_data = cek.data;

            if (new_data.status_pendaftaran === "buka" && !isChecked) {
                setIsChecked(true);
            } else if (new_data.status_pendaftaran !== "buka" && isChecked) {
                setIsChecked(false);
            }
        }
    }, [cek?.data, isChecked]);
    return (
        <Template>
            <PanelContent title={"Data Santri Baru"}>
                {isLoading && (
                    <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                </div>
                )}
                {error && (
                    <div className="flex justify-center items-center h-96">
                    <h1 className="text-2xl font-semibold">Terjadi Kesalahan</h1>
                </div>
                )}
                <div className="flex flex-row">
                    <div className="flex flex-col w-full md:w-1/2 bg-white border-1 rounded m-7">
                        <div className="flex justify-center mt-3">
                            <div className="flex flex-row w-11/12">
                                <h1 className="text-2xl font-semibold">Pengaturan Pendaftaran</h1>
                                <div className="justify-end m-2">
                                    <label
                                        className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
                                        <input
                                            type='checkbox'
                                            name='autoSaver'
                                            className='sr-only'
                                            checked={isChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        <span
                                            className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-primary' : 'bg-[#CCCCCE]'}`}>
                                        <span
                                            className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''}`}></span>
                                    </span>
                                        <span className='label flex items-center text-sm font-medium text-black'>
                                        pendaftaran sedang di <span className='pl-1'> {isChecked ? 'buka' : 'tutup'} </span>
                                    </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full md:w-1/2 bg-white border-1 rounded m-7">
                        <h1 className="text-2xl font-semibold">Pengaturan Aplikasi</h1>
                    </div>
                </div>
            </PanelContent>
        </Template>
    );
};

export default Index;