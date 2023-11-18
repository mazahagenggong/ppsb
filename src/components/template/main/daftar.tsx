import React from 'react';
import useSWR from "swr";
import axios from "axios";
import { useLokasiStore } from '@/utils/lokasi';

const cekLokasi = async (url: string) => {
    const res = await axios.get(url);
    const prov = res.data;
    return await prov.sort((a: { nama: string; }, b: { nama: any; }) => a.nama.localeCompare(b.nama));
}
type jenisType = "provinsi" | "kabkot" | "kecamatan" | "keldes";
const Daftar = () => {
    const lokasiStore = useLokasiStore();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const {
        selectedProv,
        setSelectedProv,
        selectedKabkot,
        setSelectedKabkot,
        selectedKecamatan,
        setSelectedKecamatan
    } = lokasiStore;
    const {
        data: provinsi,
        isLoading: lprov,
        error: eprov
    } = useSWR('https://cdn.jsdelivr.net/gh/abunaum/lokasi@main/allprov.json', cekLokasi);
    const {
        data: kabkot,
        isLoading: lkabkot,
        error: ekabkot
    } = useSWR(selectedProv !== null ? `https://cdn.jsdelivr.net/gh/abunaum/lokasi@main/provinsi/${selectedProv}.json` : '', cekLokasi);
    const {
        data: kec,
        isLoading: lkec,
        error: ekec
    } = useSWR(selectedKabkot !== null ? `https://cdn.jsdelivr.net/gh/abunaum/lokasi@main/kabupaten/${selectedKabkot}.json` : '', cekLokasi);
    const {
        data: keldes,
        isLoading: lkeldes,
        error: ekeldes
    } = useSWR(selectedKecamatan !== null ? `https://cdn.jsdelivr.net/gh/abunaum/lokasi@main/kecamatan/${selectedKecamatan}.json` : '', cekLokasi);
    const handlelokasi = (value: string, jenis: jenisType) => {
        switch (jenis) {
            case 'provinsi':
                setSelectedProv(value !== '-- Pilih --' ? value : null);
                break;
            case 'kabkot':
                setSelectedKabkot(value !== '-- Pilih --' ? value : null);
                break;
            case 'kecamatan':
                setSelectedKecamatan(value !== '-- Pilih --' ? value : null);
                break;
            case 'keldes':
                break;
            default:
                break;
        }
    }
    return (
        <>
            <section id="daftar">
                <div className="container" data-aos="fade-up" style={{marginTop: "-120px"}}>
                    <div className="breadcrumbs" data-aos="fade-in">
                        <div className="section-title">
                            <h2>Formulir Pendaftaran</h2>
                        </div>
                        <form className="w-full max-w-full">
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-first-name">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        id="grid-first-name" type="text"/>
                                    {/*<p className="text-red-500 text-xs italic">Please fill out this field.</p>*/}
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="jk">
                                        Jenis Kelamin
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="jk">
                                            <option>-- Pilih --</option>
                                            <option value="lk">Laki - Laki</option>
                                            <option value="pr">Perempuan</option>
                                        </select>
                                        <div
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 20 20">
                                                <path
                                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="ip">
                                        Info Pendaftaran
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="ip">
                                            <option>-- Pilih --</option>
                                            <option value="medsos">Media Sosial</option>
                                            <option value="website">Website</option>
                                            <option value="brosur/banner">Brosur / Banner</option>
                                            <option value="keluarga/teman">Keluarga / Teman</option>
                                            <option value="alumni">Alumni</option>
                                        </select>
                                        <div
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 20 20">
                                                <path
                                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/2 px-3">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="nohp">
                                        Nomor Handphone
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="nohp" type="number" placeholder="08**********"/>
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="nohp">
                                        Sekolah Asal
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="nohp" type="text"/>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-2">
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="provinsi">
                                        Provinsi
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="provinsi" onChange={(e) => {
                                            handlelokasi(e.target.value, "provinsi")
                                        }}>
                                            <option>-- Pilih --</option>
                                            {provinsi && provinsi.map((item: any, key: number) => (
                                                <option key={key} value={item.id}>{item.nama}</option>
                                            ))}
                                        </select>
                                        <div
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 20 20">
                                                <path
                                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="kabkot">
                                        Kabupaten / Kota
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="kabkot" onChange={(e) => {
                                            handlelokasi(e.target.value, "kabkot")
                                        }}>
                                            <option>-- Pilih --</option>
                                            {selectedProv !== null && kabkot && kabkot.map((item: any, key: number) => (
                                                <option key={key} value={item.id}>{item.nama}</option>
                                            ))}
                                        </select>
                                        <div
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 20 20">
                                                <path
                                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="kecamatan">
                                        Kecamatan
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="kecamatan" onChange={(e) => {
                                            handlelokasi(e.target.value, "kecamatan")
                                        }}>
                                            <option>-- Pilih --</option>
                                            {selectedProv !== null && selectedKabkot !== null && kec && kec.map((item: any, key: number) => (
                                                <option key={key} value={item.id}>{item.nama}</option>
                                            ))}
                                        </select>
                                        <div
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 20 20">
                                                <path
                                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="keldes">
                                        Desa / Kelurahan
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="keldes" onChange={(e) => {
                                            handlelokasi(e.target.value, "keldes")
                                        }}>
                                            <option>-- Pilih --</option>
                                            {selectedProv !== null && selectedKabkot !== null && selectedKecamatan && keldes && keldes.map((item: any, key: number) => (
                                                <option key={key} value={item.id}>{item.nama}</option>
                                            ))}
                                        </select>
                                        <div
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 20 20">
                                                <path
                                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Daftar;