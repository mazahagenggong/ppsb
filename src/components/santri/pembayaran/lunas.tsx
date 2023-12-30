import React, {useEffect} from 'react';
import FormulirSantri from "@/components/santri/formulir";
import Finish from "@/components/santri/finish";

const Lunas = (data: any) => {
    const {data: dataSantri} = data;
    const [santri, setSantri] = React.useState(dataSantri);
    useEffect(() => {
        setSantri(dataSantri);
    }, [dataSantri]);
    console.log(santri)
    return (
        <>
            {!santri.biodata ? (
                <>
                    <div className="alert alert-success text-center mb-3" role="alert">
                        Bukti pembayaran biaya pendaftaran telah di verifikasi <br/><strong>Silahkan Lengkapi formulir
                        dibawah
                        ini</strong>
                    </div>
                    <hr/>
                    <FormulirSantri data={santri} token={null} modal={null}/>
                    <div className="alert alert-warning text-center mb-3" role="alert">
                        Bingung dan ingin dibantu ? <br/><strong>Silahkan ke panitia PSB dengan membawa Foto Copy KK dan
                        Foto
                        Copy IJAZAH / Surat keterangan LULUS</strong>
                    </div>
                </>
            ) : (
                <Finish data={santri}/>
            )
            }
        </>
    )
        ;
};

export default Lunas;