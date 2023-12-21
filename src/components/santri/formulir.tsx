import React from 'react';
import useSWR from "swr";
import {getCookie} from "cookies-next";
import axios from "axios";
import {useForm, SubmitHandler, UseFormRegister} from "react-hook-form"

const FormulirSantri = () => {
    const token = getCookie("token_santri");
    const fetcher = async (url: string) => {
        const data = await axios.post(url, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        return data.data;
    };
    const {data: santri, error, isLoading} = useSWR("/api/auth/santri/detail", fetcher);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<any>()
    // eslint-disable-next-line react/display-name
    const Select = React.forwardRef<
        HTMLSelectElement,
        { label: string } & ReturnType<UseFormRegister<any>>
    >(({ onChange, onBlur, name, label }, ref) => (
        <>
            <label>{label}</label>
            <select name={name} ref={ref} onChange={onChange} onBlur={onBlur}>
                <option value="20">20</option>
                <option value="30">30</option>
            </select>
        </>
    ))

    const onSubmit: SubmitHandler<any> = (data) => console.log(data)
    return (
        <div className="flex flex-col">
            <div className="alert alert-success text-center mb-3" role="alert">
                Bukti pembayaran biaya pendaftaran telah di verifikasi <br/><strong>Silahkan Lengkapi formulir dibawah
                ini</strong>
            </div>
            <hr/>
            {isLoading && (
                <>
                    <div id="loading" className="loading-container">
                        <div className="loading">
                        </div>
                    </div>
                </>
            )}
            {error && (
                <>
                    <h1 className="text-2xl font-bold text-gray-700">Terhadi Kesalahan</h1>
                </>
            )}
            {santri && (
                <>
                    <form className={"mb-3"} onSubmit={handleSubmit(onSubmit)}>
                        <b># BIODATA DIRI</b>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="inputEmail4">Nama</label>
                                <input type="text" className="form-control" placeholder="Nama Lengkap"
                                       defaultValue={santri.data.nama} disabled={true}/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="kelamin">Jenis Kelamin</label>
                                <input type="text" className="form-control" placeholder="Jenis kelamin"
                                       defaultValue={santri.data.jk === "lk" ? "Laki-Laki" : "Perempuan"} disabled={true}/>

                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="tempat_lahir">Tempat Lahir</label>
                                <input type="text" className="form-control" id="tempat_lahir" name="tempat_lahir"
                                       placeholder="Tempat Lahir"/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="tanggal_lahir">Tanggal Lahir</label>
                                <input type="date" id="tanggal_lahir" className={"date form-control"}
                                       name={"tanggal_lahir"}/>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="nisn">NISN</label>
                                <input type="number" className="form-control" id="nisn" name="nisn" placeholder="NISN"
                                />
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="nik">NIK</label>
                                <input type="number" className="form-control" id="nik" name="nik" placeholder="NIK"/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="kip">Penerima KIP ?</label>
                                <select className="form-control" name="kip" id="kip">
                                    <option defaultValue="Tidak">Tidak</option>
                                    <option defaultValue="Ya">Ya</option>

                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="jurusan">Jurusan</label>
                                <select className="form-control" {...register("jurusan")}>
                                    <option defaultValue="">-- Pilih Jurusan --</option>
                                    <option defaultValue="PK">Ilmu Agama Islam (PK)</option>
                                    <option defaultValue="IPAS">Ilmu Alam dan Sosial (IPAS)</option>
                                </select>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="no_hp">Nomor Handphone</label>
                                <input type="number" className="form-control" defaultValue={santri.data.hp}
                                       placeholder="08xxxxxxxx" disabled={true}/>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="jml_saudara">Jumlah Saudara</label>
                                <input type="number" className="form-control" {...register("jumlah_saudara")}/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="anak_ke">Anak Ke</label>
                                <input type="number" className="form-control" id="anak_ke" name="anak_ke"/>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="provinsi">Provinsi</label>
                                <input type="text" className="form-control" defaultValue={santri.data.alamat.provinsi} disabled={true}/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="kabkot">Kota / Kabupaten</label>
                                <input type="text" className="form-control" defaultValue={santri.data.alamat.kabkot} disabled={true}/>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="kecamatan">Kecamatan</label>
                                <input type="text" className="form-control" defaultValue={santri.data.alamat.kecamatan} disabled={true}/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="keldes">Kelurahan / Desa</label>
                                <input type="text" className="form-control" defaultValue={santri.data.alamat.keldes} disabled={true}/>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full m-2">
                                <label htmlFor="alamat">Alamat</label>
                                <input type="text" className="form-control" defaultValue={santri.data.alamat.alamat} disabled={true}/>
                            </div>
                        </div>
                        <hr/>
                        <b># BIODATA SEKOLAH ASAL</b>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="nama_sekolah">Nama Sekolah Asal</label>
                                <input type="text" className="form-control" placeholder="Nama sekolah asal" defaultValue={santri.data.sekolah} disabled={true}/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="npsn">NPSN <a
                                    href="https://referensi.data.kemdikbud.go.id/pendidikan/dikdas"
                                    target="_blank">cari</a></label>
                                <input type="number" className="form-control" {...register("npsn")}/>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full m-2">
                                <label htmlFor="alamat_sekolah">Alamat</label>
                                <input type="text" className="form-control" {...register("alamat_sekolah")}
                                       placeholder="Alamat sekolah"/>
                            </div>
                        </div>

                        <hr/>
                        <b># BIODATA AYAH</b>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="nama_ayah">Nama</label>
                                <input type="text" className="form-control" {...register("nama_ayah")}
                                       placeholder="Nama ayah"/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="nik_ayah">NIK</label>
                                <input type="number" className="form-control" {...register("nik_ayah")}
                                       placeholder="NIK"/>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="pendidikan_ayah">Pendidikan Terakhir</label>
                                <input type="text" className="form-control" {...register("pendidikan_ayah")}
                                       placeholder="Pendidikan ayah"/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="pekerjaan_ayah">Pekerjaan</label>
                                <input type="text" className="form-control" {...register("pekerjaan_ayah")}
                                       placeholder="Pekerjaan ayah"/>
                            </div>
                        </div>
                        <hr/>
                        <b># BIODATA IBU</b>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="nama_ibu">Nama</label>
                                <input type="text" className="form-control" {...register("nama_ibu")}
                                       placeholder="Nama ibu"/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="nik_ibu">NIK</label>
                                <input type="number" className="form-control" {...register("nik_ibu")}
                                       placeholder="NIK"/>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="pendidikan_ibu">Pendidikan Terakhir</label>
                                <input type="text" className="form-control" {...register("pendidikan_ibu")}
                                       placeholder="Pendidikan ibu"/>
                            </div>
                            <div className="form-group w-full md:w-1/2 m-2">
                                <label htmlFor="pekerjaan_ibu">Pekerjaan</label>
                                <input type="text" className="form-control" {...register("pekerjaan_ibu")}
                                       placeholder="Pekerjaan ibu"/>
                            </div>
                        </div>
                        <hr/>
                        <div className="justify-center">
                            <button className="btn btn-primary w-full" type={"submit"}>Simpan</button>
                        </div>
                    </form>
                    <div className="alert alert-warning text-center mb-3" role="alert">
                        Bingung dan ingin dibantu ? <br/><strong>Silahkan ke panitia PSB dengan membawa Foto Copy KK dan Foto Copy IJAZAH / Surat keterangan LULUS</strong>
                    </div>
                </>
            )}
        </div>
    );
};

export default FormulirSantri;