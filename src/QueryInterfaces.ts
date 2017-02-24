// Essentially pulled from/mirrored with api code.  Could consolidate.

export enum ExecutionStatusCode {
    Undefined = 0,
    Initializing = 1,
    Running = 2,
    Orphaned = 3,   // Was marked initialized/running but can not longer find in process manager list
    Complete = 4
}

export enum CompletionStatusCode {
    Unknown = 0,
    Incomplete = 1,
    Cancel = 2,
    Success = 3,
    Error = 4
}

export enum ExecutionStatus {
    Undefined = -1,
    Unknown = 0,
    Started = 1,
    Online = 2,
    Restarted = 3,
    RestartOverLimit = 4,
    Stopping = 5,
    Stopped = 6,
    Exited = 7,
    Deleted = 8
}

export interface ITaskDefinition {
    id: string;
    name: string;
    script: string;
    interpreter: string;
    work_units: number;
    description: string;
}

export interface IRunningTask {
    id: string;
    work_units: number;
    resolved_script: string;
    resolved_args: string;
    max_cpu: number;
    max_memory: number;
    started_at: string;
}

export interface IExecutedTask {
    id: string;
    machine_id: string;
    task_id: string;
    task: ITaskDefinition;
    work_units: number;
    resolved_script: string;
    resolved_interpreter: string;
    resolved_args: string;
    last_process_status_code: number;
    completion_status_code: number;
    execution_status_code: number;
    exit_code: number;
    max_cpu: number;
    max_memory: number;
    started_at: string;
    completed_at: string;
}

export interface ITaskStatistics {
    id: string;
    task_id: string;
    task: ITaskDefinition;
    num_execute: number;
    num_complete: number;
    num_error: number;
    num_cancel: number;
    cpu_average: number;
    cpu_high: number;
    cpu_low: number;
    memory_average: number;
    memory_high: number;
    memory_low: number;
    duration_average: number;
    duration_high: number;
    duration_low: number;
}