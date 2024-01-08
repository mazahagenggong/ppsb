import type {NextApiRequest} from "next";

export const Origin = async (req: NextApiRequest) => {
    const allowedDomains = ['http://localhost:3000','https://ppsb.mazainulhasan1.sch.id','https://ppsb.vercel.app','https://beta-ppsb.vercel.app'];
    const clientOrigin = req.headers.origin;
    if (!clientOrigin || !allowedDomains.includes(clientOrigin)) {
        return {
            success: false,
            origin: clientOrigin,
        };
    } else {
        return {
            success: true,
            origin: clientOrigin,
        };
    }
}