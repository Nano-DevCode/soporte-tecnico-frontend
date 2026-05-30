export interface ItAssetsStatusResponse {
    itAssetsStatus: ItAssetsStatus[];
}

export interface ItAssetsStatus {
    id:          string;
    name:        string;
    description: string;
}
