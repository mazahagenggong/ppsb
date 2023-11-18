import create from 'zustand';

type LokasiStore = {
    selectedProv: string | null;
    selectedKabkot: string | null;
    selectedKecamatan: string | null;
    setSelectedProv: (value: string | null) => void;
    setSelectedKabkot: (value: string | null) => void;
    setSelectedKecamatan: (value: string | null) => void;
};

export const useLokasiStore = create<LokasiStore>((set) => ({
    selectedProv: null,
    selectedKabkot: null,
    selectedKecamatan: null,
    setSelectedProv: (value) => set({ selectedProv: value }),
    setSelectedKabkot: (value) => set({ selectedKabkot: value }),
    setSelectedKecamatan: (value) => set({ selectedKecamatan: value }),
}));