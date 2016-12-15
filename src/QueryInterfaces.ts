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

export interface IExecutedTask {
    id: string;
    task_id: string;
    script_args: string;
    resolved_script: string;
    resolved_interpreter: string;
    last_process_status_code: number;
    completion_status_code: number;
    execution_status_code: number;
}