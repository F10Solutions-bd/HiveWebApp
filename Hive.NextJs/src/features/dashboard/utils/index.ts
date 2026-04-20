export const getTop5 = (data) => {
    return data.filter(x => x.rank <= 5);
};