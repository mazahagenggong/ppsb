import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from 'moment';
import 'moment/locale/id';

moment.locale('id');

const formatDate = (createdAt: string) => {
    return moment(createdAt).format('DD MMMM YYYY | hh:mm:ss A');
};
const createPDF = async (data: any,id:string) => {
    const app_url = process.env.APP_URL ?? 'http://localhost:3000';
    const url_qr = `${app_url}/downloads/formulir/${id}`;
    const url = `https://quickchart.io/qr?text=${url_qr}&dark=018417&margin=2&size=300&centerImageUrl=https%3A%2F%2Fi.ibb.co%2Fb2hZf16%2Fmalogo.png`
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
    });

    let fy = 3;
    const pw = doc.internal.pageSize.getWidth();
    const iw = 160;
    const ih = 30;
    const cx = (pw - iw) / 2;
    doc.addImage(`${app_url}/assets/img/kop.jpg`, 'JPEG', cx, fy, iw, ih);

    fy = fy + ih;
    const hbpp = 7;
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.text("Bukti Pendaftaran PSB 2024", 105, fy + hbpp, {align: 'center'});

    fy = fy + hbpp;
    const hdp = 5;
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text("Data pendaftar : ", 10, fy + hdp, {align: 'left'});

    fy = fy + hdp;
    autoTable(doc, {
        body: [
            ['Nomor Peserta', data.nomor],
            ['Kode Login', data.kode],
            ['Nama lengkap', data.nama.toUpperCase()],
            ['Jenis Kelamin', data.jk === "lk" ? "Laki-laki" : "Perempuan"],
            ['Nomor HP', data.hp],
        ],
        startY: fy + 5,
        theme: 'striped',
        didDrawPage: function (data: any) {
            if (data.cursor.y) {
                fy = data.cursor?.y + 5;
            }
        },
    });

    doc.text("Alamat Pendaftar:", 10, fy, {align: 'left'});
    autoTable(doc, {
        body: [
            ['Provinsi', data.alamat.provinsi],
            ['Kabupaten / Kota', data.alamat.kabkot],
            ['Kecamatan', data.alamat.kecamatan],
            ['Desa / Kelurahan', data.alamat.keldes],
            ['Dusun / Jln.', `${data.alamat.alamat} RT ${data.alamat.rt} RW ${data.alamat.rw}`]
        ],
        startY: fy + 5,
        theme: 'striped',
        didDrawPage: function (data: any) {
            if (data.cursor.y) {
                fy = data.cursor?.y + 7;
            }
        },
    });

    doc.text("Informasi Gelombang:", 10, fy, {align: 'left'});
    autoTable(doc, {
        body: [
            ['Jenis Gelombang', data.gelombang.nama],
            ['Durasi Gelombang', data.gelombang.keterangan],
            ['Biaya', data.gelombang.biaya],
        ],
        startY: fy + 5,
        theme: 'striped',
        didDrawPage: function (data: any) {
            if (data.cursor.y) {
                fy = data.cursor?.y + 7;
            }
        },
    });

    doc.text("Informasi Tambahan:", 10, fy, {align: 'left'});
    autoTable(doc, {
        body: [
            ['Sekolah Asal', data.sekolah.toUpperCase()],
            ['Info Pendaftaran', data.ip.toUpperCase()],
            ['Waktu Pendaftaran', formatDate(data.created_at)]
        ],
        startY: fy + 5,
        theme: 'striped',
        didDrawPage: function (data: any) {
            if (data.cursor.y) {
                fy = data.cursor?.y + 5;
            }
        },
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const imageWidth = 30;
    const imageHight = 30;
    const centerX = (pageWidth - imageWidth) / 2;
    doc.addImage(url, 'JPEG', centerX, fy, imageWidth, imageHight);
    fy = fy + 5 + imageHight;
    autoTable(doc, {
        body: [
            ['• Bukti pendaftaran ini sebagai tanda sudah terdaftar sebagai Calon Santri Baru Tahun Pelajaran 2024/2025\n' +
            '• Silahkan melakukan pembayaran baik melalui panitia langsung atau transfer\n' +
            '• Pembayaran dapat ditransfer melalui REKENING RESMI PSB BANK SYARIAH INDONESIA (BSI) : 670-670-889-6\n' +
            '• Silahkan masuk ke menu Login kemudian upload bukti pembayaran'],
        ],
        startY: fy,
        theme: 'striped',
    });
    const namaurl = data.nama.toUpperCase().replace(/\s/g, "-");
    doc.save(`Bukti-Pendaftaran-${namaurl}.pdf`);
}

export default createPDF;