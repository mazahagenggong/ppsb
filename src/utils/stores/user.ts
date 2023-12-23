import {create} from 'zustand';

type UserStore = {
    nama: string | null;
    username: string | null;
    role: string | null;
    setNama: (value: string | null) => void;
    setRole: (value: string | null) => void;
    setUsername: (value: string | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    nama: null,
    username: null,
    role: null,
    setNama: (value) => set({nama: value}),
    setRole: (value) => set({role: value}),
    setUsername: (value) => set({username: value}),
}));