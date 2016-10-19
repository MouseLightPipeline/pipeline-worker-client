export interface ITaskDefinition {
    id: string;
    name: string;
    script: string;
    interpreter: string;
    description: string;
}

export interface IRunningTask {
    id: string;
    started_at: string;
    resolved_script: string;
    max_cpu: number;
    max_memory: number;
}