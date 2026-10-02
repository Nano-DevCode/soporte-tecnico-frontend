export interface ToolsInvoicesResponse {
    toolsInvoices: Invoice[];
    meta:     Meta;
}

export interface Invoice {
    id:         string;
    idInternal: string;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}
