import create from 'zustand';

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

export const useLokasiStore = create<LokasiStore>((set) => ({
    selectedProv: null,
    selectedKabkot: null,
    selectedKecamatan: null,
    selectedKeldes: null,
    rt: null,
    rw: null,
    alamat: null,
    setSelectedProv: (value) => set({ selectedProv: value }),
    setSelectedKabkot: (value) => set({ selectedKabkot: value }),
    setSelectedKecamatan: (value) => set({ selectedKecamatan: value }),
    setSelectedKeldes: (value) => set({ selectedKeldes: value }),
    setrt: (value) => set({ rt: value }),
    setrw: (value) => set({ rw: value }),
    setalamat: (value) => set({ alamat: value }),
}));