import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import runMiddleware from "@/utils/runMiddleware";
import { Admin } from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import { card } from "@/utils/card";

const deletedata = async function (req: NextApiRequest) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return {
      status: 401,
      data: {
        success: false,
        message: "token tidak ada",
      },
    };
  }
  const cek_token = await Admin(token);
  if (!cek_token.success) {
    return {
      status: 401,
      data: {
        success: false,
        message: cek_token.message,
      },
    };
  }
  const reqquery = req.query;
  if (!reqquery.id) {
    return {
      status: 401,
      data: {
        success: false,
        message: "user tidak ada",
      },
    };
  }
  const id = reqquery.id;
  try {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
        select: {
          id: true,
          username: true,
          nama: true,
          role: true,
        },
      });
      if (!user) {
        return {
          status: 401,
          data: {
            success: false,
            message: "user tidak ada",
          },
        };
      }
      if (id === user.id) {
        return {
          status: 401,
          data: {
            success: false,
            message: "tidak bisa menghapus diri sendiri",
          },
        };
      }
      await prisma.user.delete({
        where: { id: id },
      });
      return {
        status: 200,
        data: {
          success: true,
          message: "berhasil menghapus user",
        },
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        data: {
          success: false,
          message: "terjadi kesalahan",
        },
      };
    }
  } finally {
    prisma.$disconnect();
  }
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cors = Cors({
    methods: ["DELETE"],
  });

  await runMiddleware(req, res, cors);

  switch (req.method) {
    case "DELETE":
      const data = await deletedata(req);
      return res.status(data.status).json(data.data);
    default:
      return res.status(404).json({
        error: "halaman tidak ada",
      });
  }
}
