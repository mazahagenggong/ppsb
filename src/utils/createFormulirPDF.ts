import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import "moment/locale/id";

moment.locale("id");

const formatDate = (createdAt: string) => {
    return moment(createdAt).format("DD MMMM YYYY");
};

const handlePrestasi = (jenis: string, santri: any) => {
    let pres;
    let pan;
    switch (jenis) {
        case "tahfidz":
            pres = "Tahfidz 5 juz"
            break;
        case "alfiyah":
            pres = "Hafal nadzam alfiyah 500 bait"
            break;
        case "porseni":
            pres = "Juara Porseni minimal tingkat kabupaten"
            break;
        case "peringkat_kelas":
            pres = "Peringkat 1 - 3 di kelas 9"
            break;
        default:
            pres = "unknown error"
    }
    if (santri.panitia) {
        pan = `- Panitia (${santri.panitia.nama})`
    } else {
        pan = ''
    }
    return `${pres} ${pan}`

}
const handleMetodePembayaran = (santri: any) => {
    if (!santri.pembayaran) {
        return 'Belum Melakukan Pembayaran'
    } else if (santri.pembayaran.status === 'menunggu') {
        if (santri.panitia) {
            return `Panitia (${santri.panitia.nama})`
        } else {
            return 'Transfer'
        }
    } else if (santri.pembayaran.status === 'Lunas') {
        if (santri.panitia) {
            return `Panitia (${santri.panitia.nama})`
        } else {
            return 'Transfer'
        }
    } else {
        return 'Terjadi Kesalahan'
    }
}
const createFormulirPDF = async (data: any) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const app_url = `${protocol}//${host}`;
    const url_qr = `${app_url}/downloads/formulir/${data.id}`;
    const url = `https://quickchart.io/qr?text=${url_qr}&dark=018417&margin=2&size=300&centerImageUrl=https%3A%2F%2Fi.ibb.co%2Fb2hZf16%2Fmalogo.png`;
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "A4",
    });

    let fy = 3;
    const pw = doc.internal.pageSize.getWidth();
    const iw = 160;
    const ih = 30;
    const cx = (pw - iw) / 2;
    doc.addImage(`${app_url}/assets/img/kop.jpg`, "JPEG", cx, fy, iw, ih);

    fy = fy + ih;
    const hbpp = 5;
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("Formulir Pendaftaran PSB 2024", 105, fy + hbpp, {
        align: "center",
    });

    fy = fy + hbpp;
    const hdp = 5;
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("Data pendaftar :", 10, fy + hdp, {align: "left"});

    fy = fy + hdp;
    autoTable(doc, {
        body: [
            ["Nomor Peserta", `: ${data.nomor}`],
            ["Nama lengkap", `: ${data.nama.toUpperCase()}`],
            ["Jenis Kelamin", `: ${data.jk === "lk" ? "Laki-laki" : "Perempuan"}`],
            ["Tempat, Tanggal Lahir", `: ${data.biodata.tempat_lahir}, ${formatDate(data.biodata.tanggal_lahir)}`],
            [
                "Alamat",
                `: ${data.alamat.alamat} RT ${data.alamat.rt} RW ${data.alamat.rw}, ${data.alamat.keldes}`,
            ],
            [
                "",
                `  ${data.alamat.kecamatan} - ${data.alamat.kabkot} - ${data.alamat.provinsi}`,
            ],
            ["Nomor HP", `: ${data.hp}`],
        ],
        startY: fy + 3,
        theme: "striped",
        columnStyles: {
            0: {cellWidth: 60},
            1: {cellWidth: 120},
        },
        styles:{
            fontSize: 10
        },
        didDrawPage: function (data: any) {
            if (data.cursor.y) {
                fy = data.cursor?.y + 5;
            }
        }
    });

    doc.text("Informasi Pendaftaran:", 10, fy, {align: "left"});
    autoTable(doc, {
        body: [
            ["Pilihan Jurusan", `: ${data.biodata.jurusan}`],
            ["Jenis Gelombang (info)", `: ${data.gelombang.nama} (${data.ip})`],
            ["Durasi Gelombang", `: ${data.gelombang.keterangan}`],
            ["Waktu Pendaftaran", `: ${formatDate(data.created_at)}`],
            ["Biaya", `: ${data.prestasi ? "Gratis" : data.gelombang.biaya}`],
            [
                data.prestasi ? "Jalur Prestasi" : "Metode Pembayaran",
                `${data.prestasi ? `: ${handlePrestasi(data.prestasi.jenis, data)}` : `: ${handleMetodePembayaran(data)}`}`,
            ],
            ["Status Pembayaran", `: ${data.pembayaran.status}`],
            [
                "Pembayaran Terverifikasi",
                `: ${formatDate(data.pembayaran.updated_at)}`,
            ],
        ],
        startY: fy + 3,
        theme: "striped",
        columnStyles: {
            0: {cellWidth: 60},
            1: {cellWidth: 120},
        },
        styles: {
            fontSize: 10
        },
        didDrawPage: function (data: any) {
            if (data.cursor.y) {
                fy = data.cursor?.y + 5;
            }
        },
    });

    doc.text("Informasi Tambahan:", 10, fy, {align: "left"});
    autoTable(doc, {
        body: [
            ["Sekolah Asal", `: ${data.sekolah.toUpperCase()}`],
            ["NPSN Sekolah Asal", `: ${data.biodata.npsn}`],
            ["Alamat Sekolah Asal", `: ${data.biodata.alamat_sekolah}`],
            ["NISN Pendaftar", `: ${data.biodata.nisn}`],
            ["Penerima KIP", `: ${data.biodata.kip !== null ? (data.biodata.kip === true ? "Ya" : "Tidak") : ""}`],
            ["Nama Ayah Pendaftar", `: ${data.biodata.nama_ayah}`],
            ["NIK Ayah Pendaftar", `: ${data.biodata.nik_ayah}`],
            ["Pekerjaan Ayah Pendaftar", `: ${data.biodata.pekerjaan_ayah}`],
            ["Pendidikan Ayah Pendaftar", `: ${data.biodata.pendidikan_ayah}`],
            ["Nama Ibu Pendaftar", `: ${data.biodata.nama_ibu}`],
            ["NIK Ibu Pendaftar", `: ${data.biodata.nik_ibu}`],
            ["Pekerjaan Ibu Pendaftar", `: ${data.biodata.pekerjaan_ibu}`],
            ["Pendidikan Ibu Pendaftar", `: ${data.biodata.pendidikan_ibu}`],
        ],
        startY: fy + 5,
        theme: "striped",
        columnStyles: {
            0: {cellWidth: 60},
            1: {cellWidth: 120},
        },
        styles:{
            fontSize: 10
        },
        didDrawPage: function (data: any) {
            if (data.cursor.y) {
                fy = data.cursor?.y + 5;
            }
        },
    });

    doc.addPage();
    const pageWidth = doc.internal.pageSize.getWidth();
    const imageWidth = 30;
    const imageHight = 30;
    const centerX = (pageWidth - imageWidth) / 2;
    let fy2 = 3;
    doc.addImage(url, "JPEG", centerX, fy2, imageWidth, imageHight);
    fy2 = fy2 + 5 + imageHight;
    autoTable(doc, {
        body: [
            [
                "• Formulir pendaftaran ini sebagai bukti valid pendaftaran PSB Tahun Pelajaran 2024/2025\n" +
                "• Silahkan melampirkan kelengkapan data berupa Ijazah SD/MI, Kartu Keluarga (KK), Akta Kelahiran, dan Ijazah MTs/SMP (bisa menyusul)",
            ],
        ],
        startY: fy2,
        theme: "striped",
        styles:{
            fontSize: 10
        },
    });
    const namaurl = data.nama.toUpperCase().replace(/\s/g, "-");
    doc.save(`Formulir-Pendaftaran-${namaurl}.pdf`);
};

export default createFormulirPDF;
