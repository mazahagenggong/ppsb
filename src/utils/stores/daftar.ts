import {create} from 'zustand';

type SiswaStore = {
    nama: string | null;
    jk: string | null;
    ip: string | null;
    prejur: string | null;
    hp: string | null;
    sekolah: string | null;
    setnama: (value: string | null) => void;
    setjk: (value: string | null) => void;
    setip: (value: string | null) => void;
    setprejur: (value: string | null) => void;
    sethp: (value: string | null) => void;
    setsekolah: (value: string | null) => void;
};

type LokasiStore = {
    selectedProv: string | null;
    selectedKabkot: string | null;
    selectedKecamatan: string | null;
    selectedKeldes: string | null;
    rt: string | null;
    rw: string | null;
    alamat: string | null;
    setSelectedProv: (value: string | null) => void;
    setSelectedKabkot: (value: string | null) => void;
    setSelectedKecamatan: (value: string | null) => void;
    setSelectedKeldes: (value: string | null) => void;
    setrt: (value: string | null) => void;
    setrw: (value: string | null) => void;
    setalamat: (value: string | null) => void;
};

export const useSiswaStore = create<SiswaStore>((set) => ({
    nama: null,
    jk: null,
    ip: null,
    prejur: null,
    hp: null,
    sekolah: null,
    setnama: (value) => set({nama: value}),
    setjk: (value) => set({jk: value}),
    setip: (value) => set({ip: value}),
    setprejur: (value) => set({prejur: value}),
    sethp: (value) => set({hp: value}),
    setsekolah: (value) => set({sekolah: value}),
}));

export const useLokasiStore = create<LokasiStore>((set) => ({
    selectedProv: null,
    selectedKabkot: null,
    selectedKecamatan: null,
    selectedKeldes: null,
    rt: null,
    rw: null,
    alamat: null,
    setSelectedProv: (value) => set({selectedProv: value}),
    setSelectedKabkot: (value) => set({selectedKabkot: value}),
    setSelectedKecamatan: (value) => set({selectedKecamatan: value}),
    setSelectedKeldes: (value) => set({selectedKeldes: value}),
    setrt: (value) => set({rt: value}),
    setrw: (value) => set({rw: value}),
    setalamat: (value) => set({alamat: value}),
}));