export const getStatusColor = (status: string) => {
    switch (status) {
        case 'booked':
            return '!bg-booked-bg !text-bg';
        case 'covered':
            return '!bg-covered-bg !text-bg';
        case 'dispatched':
            return '!bg-dispatched-bg !text-bg';
        case 'in_transit':
            return '!bg-intransit-bg !text-bg';
        case 'delivered':
            return '!bg-delivered-bg !text-bg';
        default:
            return '!bg-secondary !text-fg';
    }
};