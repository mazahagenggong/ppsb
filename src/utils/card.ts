export const siswacard = async function (model: any, reqbody: any, search_list: string[], sort_by: any) {
    let start: number;
    let length;
    if (typeof reqbody.start === 'undefined') {
        start = 0;
    } else {
        start = parseInt(reqbody.start);
    }
    if (typeof reqbody.length === 'undefined') {
        length = 10;
    } else {
        length = parseInt(reqbody.length);
    }

    if (typeof reqbody.page === 'undefined') {
        start = 0;
    } else {
        const page = parseInt(reqbody.page);
        start = (page * length) - length;
    }
    const search = reqbody.keyword ?? '';
    const where: any = {};
    const countWhere: any = {};

    if (search !== '' && search_list !== null) {
        countWhere.OR = search_list.map((item) => ({[item]: {contains: search, mode: 'insensitive'}}));
        where.OR = [
            ...search_list.map((item) => ({[item]: {contains: search, mode: 'insensitive'}})),
        ];
    }
    const orderBy = sort_by;

    const count = await model.count({
        where: countWhere,
    });

    let datas;

    let query;
    try {
        if (length >= 1) {
            query = {
                where,
                orderBy: orderBy,
                skip: start,
                take: length,
            }
        } else {
            query = {
                where,
                orderBy,
                skip: start,
            }
        }
        const included_query = {
            include: {
                pembayaran: true,
                gelombang: true,
                panitia: true,
            }
        }
        query = {...query, ...included_query};
        datas = await model.findMany(query);

        // Proses datas sesuai dengan kebutuhan Anda
        const newdata = datas.map((data: any, index: number) => {
            return {
                nomor_urut: start + index + 1,
                ...data,
            };
        });

        return {
            status: 200,
            data: {
                start,
                length,
                recordsTotal: count,
                recordsFiltered: count,
                data: newdata,
            }
        };
    } catch (error) {
        console.log(error)
        return {
            status: 200,
            data: {
                error
            }
        };
    }

}

export const siswacardverif = async function (model: any, reqbody: any, search_list: string[], sort_by: any) {
    let start: number;
    let length;
    if (typeof reqbody.start === 'undefined') {
        start = 0;
    } else {
        start = parseInt(reqbody.start);
    }
    if (typeof reqbody.length === 'undefined') {
        length = 10;
    } else {
        length = parseInt(reqbody.length);
    }

    if (typeof reqbody.page === 'undefined') {
        start = 0;
    } else {
        const page = parseInt(reqbody.page);
        start = (page * length) - length;
    }
    const search = reqbody.keyword ?? '';
    const where: any = {};
    const countWhere: any = {};

    if (search !== '' && search_list !== null) {
        countWhere.OR = search_list.map((item) => ({[item]: {contains: search, mode: 'insensitive'}}));
        where.OR = [
            ...search_list.map((item) => ({[item]: {contains: search, mode: 'insensitive'}})),
        ];
    }
    const orderBy = sort_by;
    const count = await model.count({
        where: countWhere,
    });

    let datas;

    let query;
    try {
        if (length >= 1) {
            query = {
                where: {
                    ...where,
                    pembayaran: {
                        status: 'menunggu',
                    },
                },
                orderBy: orderBy,
                skip: start,
                take: length,
            }
        } else {
            query = {
                where: {
                    ...where,
                    pembayaran: {
                        status: 'menunggu',
                    },
                },
                orderBy,
                skip: start,
            }
        }
        const included_query = {
            include: {
                pembayaran: true,
                gelombang: true,
                panitia: true,
            }
        }
        query = {...query, ...included_query};

        datas = await model.findMany(query);

        const newdata = datas.map((data: any, index: number) => {
            return {
                nomor_urut: start + index + 1,
                ...data,
            };
        });

        return {
            status: 200,
            data: {
                start,
                length,
                recordsTotal: count,
                recordsFiltered: count,
                data: newdata,
            }
        };
    } catch (error) {
        console.log(error)
        return {
            status: 200,
            data: {
                error
            }
        };
    }

}