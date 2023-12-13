import jwt from "jsonwebtoken";
import prisma from "@/utils/prisma";

export const Admin = async (token:string) =>{
    try {
        const cek_token: any = jwt.verify(token, process.env.JWT_SECRET ?? '');
        if (!cek_token.id) {
            return {
                success: false,
                message: 'Token tidak valid'
            }
        }
        const id_user = await cek_token.id ?? 'xxx';
        const user = await prisma.user.findUnique({
            where: {id: id_user},
            select: {
                id: true,
                username: true,
                nama: true,
                role: true,
            },
        });
        if (!user) {
            return {
                success: false,
                message: "user tidak ditemukan",
            };
        }
        if (user.role !== 'admin') {
            return {
                success: false,
                message: "user tidak memiliki akses",
            };
        }
        return {
            success: true,
            message: "berhasil mengambil data user",
            data: user

        }
    } catch (error: any) {
        return {
            success: false,
            message: "Gagal mengambil data user",
        };
    }
}

export const Panitia = async (token:string) =>{
    try {
        const cek_token: any = jwt.verify(token, process.env.JWT_SECRET ?? '');
        if (!cek_token.id) {
            return {
                success: false,
                message: 'Token tidak valid'
            }
        }
        const id_user = await cek_token.id ?? 'xxx';
        const user = await prisma.user.findUnique({
            where: {id: id_user},
            select: {
                id: true,
                username: true,
                nama: true,
                role: true,
            },
        });
        if (!user) {
            return {
                success: false,
                message: "user tidak ditemukan",
            };
        }
        if (user.role !== 'panitia' && user.role !== 'admin') {
            return {
                success: false,
                message: "user tidak memiliki akses",
            };
        }
        return {
            success: true,
            message: "berhasil mengambil data user",
            data: user

        }
    } catch (error: any) {
        return {
            success: false,
            message: "Gagal mengambil data user",
        };
    }
}