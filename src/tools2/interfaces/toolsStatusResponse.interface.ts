export interface ToolsStatusResponse {
    toolsStatus: ToolsStatus[];
}

export interface ToolsStatus {
    id:          string;
    name:        string;
    description: string;
}
