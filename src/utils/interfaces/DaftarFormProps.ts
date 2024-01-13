export interface DaftarFormProps {
    tampilan: string;
    ubahTampilan: (nilaiTampilan: string) => void;
    nama: string | null;
    setnama: (value: string | null) => void;
    jk: string | null;
    setjk: (value: string | null) => void;
    ip: string | null;
    setip: (value: string | null) => void;
    prejur: string | null;
    setprejur: (value: string | null) => void;
    hp: string | null;
    sethp: (value: string | null) => void;
    sekolah: string | null;
    setsekolah: (value: string | null) => void;
    selectedProv: string | null;
    setSelectedProv: (value: string | null) => void;
    selectedKabkot: string | null;
    setSelectedKabkot: (value: string | null) => void;
    selectedKecamatan: string | null;
    setSelectedKecamatan: (value: string | null) => void;
    selectedKeldes: string | null;
    setSelectedKeldes: (value: string | null) => void;
    rt: string | null;
    setrt: (value: string | null) => void;
    rw: string | null;
    setrw: (value: string | null) => void;
    alamat: string | null;
    setalamat: (value: string | null) => void;
}

export interface ResponseDaftar {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}