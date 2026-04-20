export const getTop5 = (data: any[]) => {
    return data.filter(x => x.rank <= 5);
};