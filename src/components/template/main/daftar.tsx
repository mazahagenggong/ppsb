import React from 'react';
import useSWR from "swr";
import axios from "axios";
import {useLokasiStore} from '@/utils/lokasi';
import Daftarpsb from "@/utils/daftar";

const cekLokasi = async (url: string) => {
    const res = await axios.get(url);
    const prov = res.data;
    return await prov.sort((a: { nama: string; }, b: { nama: any; }) => a.nama.localeCompare(b.nama));
}
type jenisType = "provinsi" | "kabkot" | "kecamatan" | "keldes" | "rt" | "rw";
const Daftar = () => {
    const lokasiStore = useLokasiStore();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const [nama, setnama] = React.useState<null | string>(null);
    const [jk, setjk] = React.useState<null | string>(null);
    const [ip, setip] = React.useState<null | string>(null);
    const [hp, sethp] = React.useState<null | string>(null);
    const [sekolah, setsekolah] = React.useState<null | string>(null);
    const {
        selectedProv,
        setSelectedProv,
        selectedKabkot,
        setSelectedKabkot,
        selectedKecamatan,
        setSelectedKecamatan,
        selectedKeldes,
        setSelectedKeldes,
        rt,
        setrt,
        rw,
        setrw,
        alamat,
        setalamat
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
    } = useSWR(selectedProv !== null ? `https://cdn.jsdelivr.net/gh/abunaum/lokasi@main/provinsi/${selectedProv.split("|")[0]}.json` : '', cekLokasi);
    const {
        data: kec,
        isLoading: lkec,
        error: ekec
    } = useSWR(selectedKabkot !== null ? `https://cdn.jsdelivr.net/gh/abunaum/lokasi@main/kabupaten/${selectedKabkot.split("|")[0]}.json` : '', cekLokasi);
    const {
        data: keldes,
        isLoading: lkeldes,
        error: ekeldes
    } = useSWR(selectedKecamatan !== null ? `https://cdn.jsdelivr.net/gh/abunaum/lokasi@main/kecamatan/${selectedKecamatan.split("|")[0]}.json` : '', cekLokasi);
    let rtrw: any = [];
    for (let i = 1; i <= 100; i++) {
        rtrw.push(i);
    }
    const handlelokasi = (value: string, jenis: jenisType) => {
        switch (jenis) {
            case 'provinsi':
                if (value === '-- Pilih --') {
                    setSelectedProv(null);
                    setSelectedKabkot(null);
                    setSelectedKecamatan(null);
                    setSelectedKeldes(null);
                    return;
                } else {
                    setSelectedProv(value);
                    setSelectedKabkot(null);
                    setSelectedKecamatan(null);
                    setSelectedKeldes(null);
                }
                break;
            case 'kabkot':
                if (value === '-- Pilih --') {
                    setSelectedKabkot(null);
                    setSelectedKecamatan(null);
                    setSelectedKeldes(null);
                    return;
                } else {
                    setSelectedKabkot(value);
                    setSelectedKecamatan(null);
                    setSelectedKeldes(null);
                }
                break;
            case 'kecamatan':
                if (value === '-- Pilih --') {
                    setSelectedKecamatan(null);
                    setSelectedKeldes(null);
                    return;
                } else {
                    setSelectedKecamatan(value);
                    setSelectedKeldes(null);
                }
                break;
            case 'keldes':
                if (value === '-- Pilih --') {
                    setSelectedKeldes(null);
                    return;
                } else {
                    setSelectedKeldes(value);
                }
                break;
                case 'rt':
                    if (value === '-- Pilih --') {
                        setrt(null);
                        return;
                    } else {
                        setrt(value);
                    }
                    break;
                case 'rw':
                    if (value === '-- Pilih --') {
                        setrw(null);
                        return;
                    } else {
                        setrw(value);
                    }
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
                                <div className="w-full md:w-1/2 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="nama">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        id="nama" type="text" onChange={(e) => setnama(e.target.value)}/>
                                    {/*<p className="text-red-500 text-xs italic">Please fill out this field.</p>*/}
                                </div>
                                <div className="w-full md:w-1/4 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="jk">
                                        Jenis Kelamin
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                            id="jk" onChange={(e) => setjk(e.target.value)}>
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
                                <div className="w-full md:w-1/4 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="ip">
                                        Info Pendaftaran
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                            id="ip" onChange={(e) => setip(e.target.value)}>
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
                                <div className="w-full md:w-1/2 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="nohp">
                                        Nomor Handphone
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="nohp" type="number" placeholder="08**********"
                                        onChange={(e) => sethp(e.target.value)}/>
                                </div>
                                <div className="w-full md:w-1/2 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="nohp">
                                        Sekolah Asal
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="nohp" type="text" onChange={(e) => setsekolah(e.target.value)}/>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-3">
                                <div className="w-full md:w-1/3 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="provinsi">
                                        Provinsi
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                            id="provinsi" onChange={(e) => {
                                            handlelokasi(e.target.value, "provinsi")
                                        }}>
                                            <option>-- Pilih --</option>
                                            {provinsi && provinsi.map((item: any, key: number) => (
                                                <option key={key} value={`${item.id}|${item.nama}`}>{item.nama}</option>
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
                                <div className="w-full md:w-1/3 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="kabkot">
                                        Kabupaten / Kota
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                            id="kabkot" onChange={(e) => {
                                            handlelokasi(e.target.value, "kabkot")
                                        }}>
                                            <option>-- Pilih --</option>
                                            {selectedProv !== null && kabkot && kabkot.map((item: any, key: number) => (
                                                <option key={key} value={`${item.id}|${item.nama}`}>{item.nama}</option>
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
                                <div className="w-full md:w-1/3 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="kecamatan">
                                        Kecamatan
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                            id="kecamatan" onChange={(e) => {
                                            handlelokasi(e.target.value, "kecamatan")
                                        }}>
                                            <option>-- Pilih --</option>
                                            {selectedProv !== null && selectedKabkot !== null && kec && kec.map((item: any, key: number) => (
                                                <option key={key} value={`${item.id}|${item.nama}`}>{item.nama}</option>
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
                                <div className="w-full md:w-1/3 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="keldes">
                                        Desa / Kelurahan
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                            id="keldes" onChange={(e) => {
                                            handlelokasi(e.target.value, "keldes")
                                        }}>
                                            <option>-- Pilih --</option>
                                            {selectedProv !== null && selectedKabkot !== null && selectedKecamatan!== null && keldes && keldes.map((item: any, key: number) => (
                                                <option key={key} value={`${item.nama}`}>{item.nama}</option>
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
                                <div className="w-full md:w-1/6 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="rt">
                                        RT
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                            id="rt" onChange={(e) => {
                                            handlelokasi(e.target.value, "rt");
                                        }}>
                                            <option>-- Pilih --</option>
                                            {rtrw && rtrw.map((item: any, key: number) => (
                                                <option key={key} value={item}>{item}</option>
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
                                <div className="w-full md:w-1/6 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="rw">
                                        RW
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                            id="rw" onChange={(e) => {
                                            handlelokasi(e.target.value, "rw");
                                        }}>
                                            <option>-- Pilih --</option>
                                            {rtrw && rtrw.map((item: any, key: number) => (
                                                <option key={key} value={item}>{item}</option>
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
                                <div className="w-full md:w-1/3 px-3 md:mb-0">
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-first-name">
                                        Alamat Dusun / Jln.
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        id="alamat" type="text" onChange={(e) => {
                                        setalamat(e.target.value);
                                    }}/>
                                </div>
                            </div>
                            <center>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                    type="button" onClick={() => {
                                    const cobadaftar = Daftarpsb({
                                        nama: nama,
                                        jk: jk,
                                        ip: ip,
                                        hp: hp,
                                        sekolah: sekolah,
                                        provinsi: selectedProv,
                                        kabkot: selectedKabkot,
                                        kecamatan: selectedKecamatan,
                                        keldes: selectedKeldes,
                                        rt: rt,
                                        rw: rw,
                                        alamat: alamat
                                    });
                                    console.log(cobadaftar);
                                }}>
                                    Daftar
                                </button>
                            </center>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Daftar;