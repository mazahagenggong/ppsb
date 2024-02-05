import React, {useEffect} from 'react';
import DaftarForm from "@/components/daftar";
import {useSiswaStore, useLokasiStore} from "@/utils/stores/daftar";
import {showWaitLoading} from "@/components/loading/waitLoading";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

const Daftar = () => {
    const [tampilan, settampilan] = React.useState<string>("awal");
    const ubahTampilan = (nilaiTampilan: string) => {
        settampilan(nilaiTampilan);
    };
    useEffect(() => {
        if (tampilan === "loading") {
            showWaitLoading('Mencoba mendaftar, silahkan menunggu')
        } else {
            MySwal.close();
        }
    }, [tampilan]);
    const lokasiStore = useLokasiStore();
    const siswaStore = useSiswaStore();
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
        sa,
        setsa,
        sekolah,
        setsekolah
    } = siswaStore;
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
    return (
        <>
            <section id="daftar">
                <div className="container" data-aos="fade-up" style={{marginTop: "-120px"}}>
                    <div className="breadcrumbs" data-aos="fade-in">
                        <div className="section-title">
                            <h2>Formulir Pendaftaran</h2>
                        </div>
                        {
                            tampilan === "awal" && (
                                <DaftarForm
                                    tampilan={tampilan}
                                    ubahTampilan={ubahTampilan}
                                    nama={nama}
                                    setnama={setnama}
                                    jk={jk}
                                    setjk={setjk}
                                    ip={ip}
                                    setip={setip}
                                    prejur={prejur}
                                    setprejur={setprejur}
                                    hp={hp}
                                    sethp={sethp}
                                    sa={sa}
                                    setsa={setsa}
                                    sekolah={sekolah}
                                    setsekolah={setsekolah}
                                    selectedProv={selectedProv}
                                    setSelectedProv={setSelectedProv}
                                    selectedKabkot={selectedKabkot}
                                    setSelectedKabkot={setSelectedKabkot}
                                    selectedKecamatan={selectedKecamatan}
                                    setSelectedKecamatan={setSelectedKecamatan}
                                    selectedKeldes={selectedKeldes}
                                    setSelectedKeldes={setSelectedKeldes}
                                    rt={rt}
                                    setrt={setrt}
                                    rw={rw}
                                    setrw={setrw}
                                    alamat={alamat}
                                    setalamat={setalamat}
                                />
                            )
                        }

                    </div>
                </div>
            </section>
        </>
    );
};

export default Daftar;