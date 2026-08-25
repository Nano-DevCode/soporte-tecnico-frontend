export interface ItemFolio {
    department_id:      string;
    department_name:    string;
    acronym:            string;
    period_id:          string;
    period_name:        string;
    current_value:      number;
    next_value:         number;
    next_folio_preview: string;
}
export interface ResponseFolio {
    period_id:          string;
    period_name:        string;
    current_value:      number;
    next_value:         number;
    next_folio_preview: string;
}

export interface OTFolio {
    year:               string;
    current_value:      number;
    next_value:         number;
    next_folio_preview: string;
}

export type DataItemFolio = keyof ItemFolio;
export type DataResponseFolio = keyof ItemFolio;
