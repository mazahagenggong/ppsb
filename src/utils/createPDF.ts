import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from 'moment';
import 'moment/locale/id';

moment.locale('id');

const formatDate = (createdAt: string) => {
    return moment(createdAt).format('DD MMMM YYYY | hh:mm:ss A');
};
const createPDF = async (data: any, url: string) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
    });
    autoTable(doc, {
        body: [
            [
                {
                    content: 'PPSB 2021',
                    styles: {
                        halign: 'center',
                        fontStyle: 'bold',
                        fontSize: 20,
                    },
                },
            ],
            [
                {
                    content: 'MA ZAINUL HASAN 1 GENGGONG',
                    styles: {
                        halign: 'center',
                        fontStyle: 'bold',
                        fontSize: 18,
                    },
                },
            ],
        ],
        theme: 'plain',
    });

    autoTable(doc, {
        body: [
            [
                {
                    content: 'Data Pendaftar:',
                    styles: {
                        halign: 'left',
                        fontStyle: 'bold',
                        fontSize: 14,
                    },
                },
            ],
        ],
        theme: 'plain',
    });

    autoTable(doc, {
        body: [
            ['Kode Login', data.kode],
            ['Nama lengkap', data.nama.toUpperCase()],
            ['Jenis Kelamin', data.jk === "lk" ? "Laki-laki" : "Perempuan"],
            ['Nomor HP', data.hp],
        ],
        theme: 'striped',
    });

    autoTable(doc, {
        body: [
            [
                {
                    content: 'Alamat Pendaftar:',
                    styles: {
                        halign: 'left',
                        fontStyle: 'bold',
                        fontSize: 14,
                    },
                },
            ],
        ],
        theme: 'plain',
    });

    autoTable(doc, {
        body: [
            ['Provinsi', data.alamat.provinsi],
            ['Kabupaten / Kota', data.alamat.kabkot],
            ['Kecamatan', data.alamat.kecamatan],
            ['Desa / Kelurahan', data.alamat.keldes],
            ['Dusun / Jln.', `${data.alamat.alamat} RT ${data.alamat.rt} RW ${data.alamat.rw}`]
        ],
        theme: 'striped',
    });

    autoTable(doc, {
        body: [
            [
                {
                    content: 'Informasi Tambahan:',
                    styles: {
                        halign: 'left',
                        fontStyle: 'bold',
                        fontSize: 14,
                    },
                },
            ],
        ],
        theme: 'plain',
    });

    autoTable(doc, {
        body: [
            ['Sekolah Asal', data.sekolah.toUpperCase()],
            ['Info Pendaftaran', data.ip.toUpperCase()],
            ['Waktu Pendaftaran', formatDate(data.created_at)]
        ],
        theme: 'striped',
    });
    let finalY = 10;

    autoTable(doc, {
        body: [],
        theme: 'plain',
        didDrawPage: function (data: any) {
            if (data.cursor.y) {
                finalY = data.cursor?.y  + 10;
            }
        },
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const imageWidth = 30;
    const imageHight = 30;
    const centerX = (pageWidth - imageWidth) / 2;
    doc.addImage(url, 'JPEG', centerX, finalY, imageWidth, imageHight);
    const namaurl = data.nama.toUpperCase().replace(/\s/g, "-");
    doc.save(`FORMULIR-${namaurl}.pdf`);
}

export default createPDF;