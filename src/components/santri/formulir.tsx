import React from 'react';
import {getCookie} from "cookies-next";
import axios from "axios";
import {useForm, SubmitHandler, UseFormRegister} from "react-hook-form";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";

interface FormulirSantriProps {
    data: any;
    token: string | null | undefined;
    modal: any;
}

const FormulirSantri: React.FC<FormulirSantriProps> = ({data, token, modal}) => {
    const dataSantri = data;
    if (!token) {
        token = getCookie("token_santri");
    }

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<any>()
    // eslint-disable-next-line react/display-name
    const SelectJurusan = React.forwardRef<
        HTMLSelectElement,
        { label: string } & ReturnType<UseFormRegister<any>>
    >(({onChange, onBlur, name, label}, ref) => (
        <>
            <label>{label} <strong style={{color: "red"}}>*</strong></label>
            <select name={name} ref={ref} onChange={onChange} onBlur={onBlur} className={"form-control"}
                    defaultValue={dataSantri?.biodata?.jurusan ?? (dataSantri?.prejur ?? "")}>
                <option value="">-- Pilih Jurusan --</option>
                <option value="PK">Ilmu Agama Islam (PK)</option>
                <option value="IPAS">Ilmu Alam dan Sosial (IPAS)</option>
            </select>
        </>
    ))

    // eslint-disable-next-line react/display-name
    const SelectKIP = React.forwardRef<
        HTMLSelectElement,
        { label: string } & ReturnType<UseFormRegister<any>>
    >(({onChange, onBlur, name, label}, ref) => (
        <>
            <label>{label}</label>
            <select name={name} ref={ref} onChange={onChange} onBlur={onBlur} className={"form-control"}
                    defaultValue={cekkip()}>
                <option value="">-- Pilih --</option>
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
            </select>
        </>
    ))

    const cekkip = () => {
        console.log(dataSantri?.biodata?.kip)
        if (!dataSantri?.biodata?.kip) {
            return ''
        } else {
            if (dataSantri.biodata.kip === true) {
                return 'ya'
            } else {
                return 'tidak'
            }
        }
    }

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            if (modal) {
                modal(false);
            }
            showWaitLoading("Menyimpan Data");
            await axios.post("/api/santri/formulir", data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            await LoadingTimer("Berhasil Menyimpan Data", "success", 2000);
            window.location.reload();
        } catch (error) {
            await LoadingTimer("Terjadi Kesalahan", "error", 2000);
        }
    }
    return (
        <div className="flex flex-col">
            <form className={"mb-3"} onSubmit={handleSubmit(onSubmit)}>
                <b># BIODATA DIRI</b>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="inputEmail4">Nama</label>
                        <input type="text" className="form-control" placeholder="Nama Lengkap"
                               defaultValue={dataSantri.nama} disabled={true}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="kelamin">Jenis Kelamin</label>
                        <input type="text" className="form-control" placeholder="Jenis kelamin"
                               defaultValue={dataSantri.jk === "lk" ? "Laki-Laki" : "Perempuan"} disabled={true}/>

                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="tempat_lahir">Tempat Lahir <strong style={{color: "red"}}>*</strong></label>
                        <input type="text" className="form-control" {...register("tempat_lahir", {required: true})}
                               placeholder="Tempat Lahir" defaultValue={dataSantri?.biodata?.tempat_lahir}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="tanggal_lahir">Tanggal Lahir <strong style={{color: "red"}}>*</strong></label>
                        <input type="date" id="tanggal_lahir" className={"date form-control"}
                               {...register("tanggal_lahir", {required: true})}
                               defaultValue={dataSantri?.biodata?.tanggal_lahir ? dataSantri.biodata.tanggal_lahir.split('T')[0] : ''}/>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="nisn">NISN</label>
                        <input type="number" className="form-control" {...register("nisn")} placeholder="NISN"
                               defaultValue={dataSantri?.biodata?.nisn}
                        />
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="nik">NIK</label>
                        <input type="number" className="form-control" {...register("nik")} placeholder="NIK"
                               defaultValue={dataSantri?.biodata?.nik}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <SelectKIP label={"Penerima KIP ?"} {...register("kip")}/>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <SelectJurusan label={"Jurusan"} {...register("jurusan", {required: true})}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="no_hp">Nomor Handphone</label>
                        <input type="number" className="form-control" defaultValue={dataSantri.hp}
                               placeholder="08xxxxxxxx" disabled={true}/>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="jml_saudara">Jumlah Saudara <strong style={{color: "red"}}>*</strong></label>
                        <input type="number" className="form-control" {...register("jumlah_saudara")}
                               defaultValue={dataSantri?.biodata?.jumlah_saudara}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="anak_ke">Anak Ke <strong style={{color: "red"}}>*</strong></label>
                        <input type="number" className="form-control" {...register("anak_ke", {required: true})}
                               defaultValue={dataSantri?.biodata?.anak_ke}/>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="provinsi">Provinsi</label>
                        <input type="text" className="form-control" defaultValue={dataSantri.alamat.provinsi}
                               disabled={true}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="kabkot">Kota / Kabupaten</label>
                        <input type="text" className="form-control" defaultValue={dataSantri.alamat.kabkot}
                               disabled={true}/>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="kecamatan">Kecamatan</label>
                        <input type="text" className="form-control" defaultValue={dataSantri.alamat.kecamatan}
                               disabled={true}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="keldes">Kelurahan / Desa</label>
                        <input type="text" className="form-control" defaultValue={dataSantri.alamat.keldes}
                               disabled={true}/>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/3 m-2">
                        <label htmlFor="kecamatan">RT</label>
                        <input type="text" className="form-control" defaultValue={dataSantri.alamat.rt}
                               disabled={true}/>
                    </div>
                    <div className="form-group w-full md:w-1/3 m-2">
                        <label htmlFor="keldes">RW</label>
                        <input type="text" className="form-control" defaultValue={dataSantri.alamat.rw}
                               disabled={true}/>
                    </div>
                    <div className="form-group w-full md:w-1/3 m-2">
                        <label htmlFor="alamat">Alamat</label>
                        <input type="text" className="form-control" defaultValue={dataSantri.alamat.alamat}
                               disabled={true}/>
                    </div>
                </div>
                <hr/>
                <b># BIODATA SEKOLAH ASAL</b>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="nama_sekolah">Nama Sekolah Asal</label>
                        <input type="text" className="form-control" placeholder="Nama sekolah asal"
                               defaultValue={dataSantri.sekolah} disabled={true}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="npsn">NPSN <a
                            href="https://referensi.data.kemdikbud.go.id/pendidikan/dikdas"
                            target="_blank" style={{textDecoration: "none"}}><i
                            className="bi bi-patch-question"></i></a></label>
                        <input type="number" className="form-control" {...register("npsn")}
                               defaultValue={dataSantri?.biodata?.npsn}/>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full m-2">
                        <label htmlFor="alamat_sekolah">Alamat</label>
                        <input type="text" className="form-control" {...register("alamat_sekolah")}
                               placeholder="Alamat sekolah" defaultValue={dataSantri?.biodata?.alamat_sekolah}/>
                    </div>
                </div>

                <hr/>
                <b># BIODATA AYAH</b>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="nama_ayah">Nama</label>
                        <input type="text" className="form-control" {...register("nama_ayah")}
                               placeholder="Nama ayah" defaultValue={dataSantri?.biodata?.nama_ayah}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="nik_ayah">NIK</label>
                        <input type="number" className="form-control" {...register("nik_ayah")}
                               placeholder="NIK" defaultValue={dataSantri?.biodata?.nik_ayah}/>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="pendidikan_ayah">Pendidikan Terakhir</label>
                        <input type="text" className="form-control" {...register("pendidikan_ayah")}
                               placeholder="Pendidikan ayah" defaultValue={dataSantri?.biodata?.pendidikan_ayah}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="pekerjaan_ayah">Pekerjaan</label>
                        <input type="text" className="form-control" {...register("pekerjaan_ayah")}
                               placeholder="Pekerjaan ayah" defaultValue={dataSantri?.biodata?.pekerjaan_ayah}/>
                    </div>
                </div>
                <hr/>
                <b># BIODATA IBU</b>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="nama_ibu">Nama</label>
                        <input type="text" className="form-control" {...register("nama_ibu")}
                               placeholder="Nama ibu" defaultValue={dataSantri?.biodata?.nama_ibu}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="nik_ibu">NIK</label>
                        <input type="number" className="form-control" {...register("nik_ibu")}
                               placeholder="NIK" defaultValue={dataSantri?.biodata?.nik_ibu}/>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="pendidikan_ibu">Pendidikan Terakhir</label>
                        <input type="text" className="form-control" {...register("pendidikan_ibu")}
                               placeholder="Pendidikan ibu" defaultValue={dataSantri?.biodata?.pendidikan_ibu}/>
                    </div>
                    <div className="form-group w-full md:w-1/2 m-2">
                        <label htmlFor="pekerjaan_ibu">Pekerjaan</label>
                        <input type="text" className="form-control" {...register("pekerjaan_ibu")}
                               placeholder="Pekerjaan ibu" defaultValue={dataSantri?.biodata?.pekerjaan_ibu}/>
                    </div>
                </div>
                <hr/>
                <div className="justify-center">
                    <button className="btn btn-primary w-full" type={"submit"}>Simpan</button>
                </div>
            </form>
        </div>
    );
};

export default FormulirSantri;