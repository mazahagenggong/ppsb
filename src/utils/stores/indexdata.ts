import {create} from 'zustand';

type IndexStore = {
    totalPendaftar: number | null;
    totalTerverifikasi: number | null;
    totalMenunggu: number | null;
    totalBelum: number | null;
    Zaha: any;
    settotalPendaftar: (value: number | null) => void;
    settotalTerverifikasi: (value: number | null) => void;
    settotalMenunggu: (value: number | null) => void;
    settotalBelum: (value: number | null) => void;
    setZaha: (value: any) => void;
};

export const useIndexStore = create<IndexStore>((set) => ({
    totalPendaftar: null,
    totalTerverifikasi: null,
    totalMenunggu: null,
    totalBelum: null,
    Zaha: null,
    settotalPendaftar: (value) => set({totalPendaftar: value}),
    settotalTerverifikasi: (value) => set({totalTerverifikasi: value}),
    settotalMenunggu: (value) => set({totalMenunggu: value}),
    settotalBelum: (value) => set({totalBelum: value}),
    setZaha: (value) => set({Zaha: value}),
}));
