import React, {useEffect} from 'react';
import FormulirSantri from "@/components/santri/formulir";
import Fotosantri from "@/components/santri/pembayaran/fotosantri";
import Finish from "@/components/santri/finish";

const Lunas = (data: any) => {
    const {data: dataSantri} = data;
    const [santri, setSantri] = React.useState(dataSantri);
    useEffect(() => {
        setSantri(dataSantri);
    }, [dataSantri]);
    return (
        <>
            {!santri.biodata && (
                <FormulirSantri data={santri}/>
            )}
            {santri.biodata && !santri.biodata.foto ?(
                <Fotosantri/>
            ) : (
                <Finish data={santri}/>
            )}
        </>
    );
};

export default Lunas;