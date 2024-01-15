import React from 'react';
import axios from "axios";
import useSWR from "swr";
import Daftarpsb from "@/utils/daftar";
import {DaftarFormProps, ResponseDaftar} from "@/utils/interfaces/DaftarFormProps";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {decrypt, encrypt} from "@/utils/crypt";
import Login from "@/components/buttons/login";
import createPDF from "@/utils/createPDF";
import {CloseSwal, LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";

const MySwal = withReactContent(Swal)

const cekLokasi = async (url: string) => {
    const res = await axios.get(url);
    const prov = res.data;
    return await prov.sort((a: { nama: string; }, b: { nama: any; }) => a.nama.localeCompare(b.nama));
}
type jenisType = "provinsi" | "kabkot" | "kecamatan" | "keldes" | "rt" | "rw";

const DaftarForm: React.FC<DaftarFormProps> = (props: DaftarFormProps) => {
        const {
            nama,
            setnama,
            jk,
            setjk,
            ip,
            setip,
            prejur,
            setprejur,
            hp,
            sethp,
            sekolah,
            setsekolah,
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
            setalamat,
        } = props;
        const {
            data: provinsi,
            isLoading: lprov,
        } = useSWR('https://cdn.jsdelivr.net/gh/abunaum/lokasi@main/allprov.json', cekLokasi);
        const {
            data: kabkot,
            isLoading: lkabkot,
        } = useSWR(selectedProv !== null ? `https://cdn.jsdelivr.net/gh/abunaum/lokasi@main/provinsi/${selectedProv.split("|")[0]}.json` : '', cekLokasi);
        const {
            data: kec,
            isLoading: lkec,
        } = useSWR(selectedKabkot !== null ? `https://cdn.jsdelivr.net/gh/abunaum/lokasi@main/kabupaten/${selectedKabkot.split("|")[0]}.json` : '', cekLokasi);
        const {
            data: keldes,
            isLoading: lkeldes,
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
        const [savedlogin, setsavedlogin] = React.useState<boolean>(false);
        const [datalogin, setdatalogin] = React.useState<any>(null);
        React.useEffect(() => {
            const cekstorage = localStorage.getItem('savedlogin');
            if (cekstorage) {
                setsavedlogin(true);
                const decryptdata = JSON.parse(decrypt(cekstorage));
                setdatalogin(decryptdata);
            }
        }, []);

        React.useEffect(() => {
            if (lprov || lkabkot || lkec || lkeldes) {
                showWaitLoading("Mengambil data lokasi.");
            } else {
                CloseSwal();
            }
        }, [lprov, lkabkot, lkec, lkeldes]);
        return (
            <React.Fragment>
                {!savedlogin ? (
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
                                    id="nama" type="text" value={nama ?? ""} onChange={(e) => setnama(e.target.value)}
                                    required={true}/>
                            </div>
                            <div className="w-full md:w-1/4 px-3 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="jk">
                                    Jenis Kelamin
                                </label>
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                        id="jk" value={jk ?? ""} onChange={(e) => setjk(e.target.value)}
                                        required={true}>
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
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                        id="ip" value={ip ?? ""} onChange={(e) => setip(e.target.value)}
                                        required={true}>
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
                            <div className="w-full md:w-1/3 px-3 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="ip">
                                    Pilih Jurusan
                                </label>
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                        id="ip" value={prejur ?? ""} onChange={(e) => setprejur(e.target.value)}
                                        required={true}>
                                        <option>-- Pilih --</option>
                                        <option value="PK">Program Keagamaan</option>
                                        <option value="UMUM">Program Umum</option>
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
                                    htmlFor="nohp">
                                    Nomor Handphone
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="nohp" type="number" placeholder="08**********" value={hp ?? ""}
                                    onChange={(e) => sethp(e.target.value)} required={true}/>
                            </div>
                            <div className="w-full md:w-1/3 px-3 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="nohp">
                                    Sekolah Asal
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="nohp" type="text" value={sekolah ?? ""}
                                    onChange={(e) => setsekolah(e.target.value)}
                                    required={true}/>
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full md:w-1/3 px-3 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="provinsi">
                                    Provinsi
                                </label>
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                        id="provinsi" value={selectedProv ?? ""} onChange={(e) => {
                                        handlelokasi(e.target.value, "provinsi")
                                    }} required={true}>
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
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                        id="kabkot" value={selectedKabkot ?? ""} onChange={(e) => {
                                        handlelokasi(e.target.value, "kabkot")
                                    }} required={true}>
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
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                        id="kecamatan" value={selectedKecamatan ?? ""} onChange={(e) => {
                                        handlelokasi(e.target.value, "kecamatan")
                                    }} required={true}>
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
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                        id="keldes" value={selectedKeldes ?? ""} onChange={(e) => {
                                        handlelokasi(e.target.value, "keldes")
                                    }} required={true}>
                                        <option>-- Pilih --</option>
                                        {selectedProv !== null && selectedKabkot !== null && selectedKecamatan !== null && keldes && keldes.map((item: any, key: number) => (
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
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                        id="rt" value={rt ?? ""} onChange={(e) => {
                                        handlelokasi(e.target.value, "rt");
                                    }} required={true}>
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
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                        id="rw" value={rw ?? ""} onChange={(e) => {
                                        handlelokasi(e.target.value, "rw");
                                    }} required={true}>
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
                                    id="alamat" type="text" value={alamat ?? ""} onChange={(e) => {
                                    setalamat(e.target.value);
                                }} required={true}/>
                            </div>
                        </div>
                        <center>
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full m-3"
                                type="submit" onClick={
                                async (e) => {
                                    e.preventDefault();
                                    props.ubahTampilan("loading");
                                    const cek: ResponseDaftar = await Daftarpsb({
                                        nama: nama?.toUpperCase(),
                                        jk: jk,
                                        ip: ip?.toUpperCase(),
                                        prejur: prejur,
                                        hp: hp,
                                        sekolah: sekolah?.toUpperCase(),
                                        provinsi: selectedProv,
                                        kabkot: selectedKabkot,
                                        kecamatan: selectedKecamatan,
                                        keldes: selectedKeldes,
                                        rt: rt,
                                        rw: rw,
                                        alamat: alamat,
                                    });
                                    if (!cek.success) {
                                        props.ubahTampilan("awal");
                                        await MySwal.fire({
                                            position: "center",
                                            icon: "error",
                                            title: "Oops!",
                                            html: "<p>" + cek.message + "</p>",
                                            showConfirmButton: false,
                                            timer: 3000
                                        });
                                        console.log(cek)
                                        return;
                                    }
                                    const cekstorage = localStorage.getItem('savedlogin');
                                    const newdata = {
                                        id: cek.data.siswa.id,
                                        kode: cek.data.siswa.kode,
                                        nama: cek.data.siswa.nama
                                    };
                                    if (cekstorage) {
                                        localStorage.removeItem('savedlogin');
                                    }
                                    const encryptdata = encrypt(JSON.stringify(newdata));
                                    localStorage.setItem('savedlogin', encryptdata);

                                    props.ubahTampilan("awal");
                                    await MySwal.fire({
                                        position: "center",
                                        icon: "success",
                                        title: "Mantap.",
                                        html: "<p>Pendaftaran berhasil.</p>" + "<br>" + "<p>Silahkan downloads dan login</p>",
                                        showConfirmButton: false,
                                        timer: 3000
                                    });
                                }
                            }>
                                Daftar
                            </button>
                            {datalogin && (
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={async () => {
                                        setsavedlogin(true);
                                    }}
                                >
                                    Tutup
                                </button>
                            )}
                        </center>
                    </form>
                ) : (
                    <div className="flex flex-wrap justify-center mb-6 items-center">
                        <div className="flex flex-col md:flex-row items-center">
                            <button
                                className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full my-3 md:mx-3"
                                onClick={async () => {
                                    setsavedlogin(false);
                                }}
                            >
                                Daftar Lagi
                            </button>

                            <button
                                className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full my-3 md:mx-3"
                                onClick={async () => {
                                    try {
                                        showWaitLoading("Membuat bukti pendaftaran.")
                                        const {data} = (await axios.post("/api/cek/siswa", {id: datalogin.id})).data;
                                        await createPDF(data);
                                        await LoadingTimer("Bukti pendaftaran berhasil di buat.", "success", 3000);
                                    } catch (e) {
                                        await LoadingTimer("Bukti pendaftaran gagal di buat.", "error", 3000);
                                    }
                                }}
                            >
                                Download Bukti Pendaftaran
                            </button>
                            <Login/>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
;

export default DaftarForm;