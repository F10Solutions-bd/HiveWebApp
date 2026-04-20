export interface Commodity {
    id: number;
    loadId: number;
    pieceCount: number;
    packageType?: string;
    dimensionUnit?: string;
    length: number;
    width: number;
    height: number;
    productDescription?: string;
    weightUnit?: string;
    weight: number;
    isHazmat: boolean;
    hazmotClass?: string;
    maximumValue: number;
    isDeleted: boolean;
}