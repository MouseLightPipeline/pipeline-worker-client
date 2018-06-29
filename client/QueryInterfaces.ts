// Essentially pulled from/mirrored with api code.  Could consolidate.

export enum ExecutionStatusCode {
    Undefined = 0,
    Initializing = 1,
    Running = 2,
    Zombie = 3,   // Was marked initialized/running but can not longer find in process manager list/cluster jobs
    Orphaned = 4, // Found in process manager with metadata that associates to worker, but no linked task in database
    Completed = 5
}

export enum CompletionStatusCode {
    Unknown = 0,
    Incomplete = 1,
    Cancel = 2,
    Success = 3,
    Error = 4,
    Resubmitted = 5
}

export enum ExecutionStatus {
    Undefined = -1,
    Unknown = 0,
    Pending = 1,
    Started = 2,
    Online = 3,
    Restarted = 4,
    RestartOverLimit = 5,
    Stopping = 6,
    Stopped = 7,
    Exited = 8,
    Deleted = 9
}

export interface IWorker {
    id: string
    process_id: number;
    display_name: string;
    local_task_load: number;
    local_work_capacity: number;
    cluster_task_load: number;
    cluster_work_capacity: number;
}

export interface ITaskDefinition {
    id: string;
    name: string;
    description: string;
    script: string;
    interpreter: string;
    script_args: string;
    cluster_args: string;
    work_units: number;
    cluster_work_units: number;
    log_prefix: string;
}

export interface IRunningTask {
    id: string;
    queue_type: number;
    local_work_units: number;
    cluster_work_units: number;
    task_definition_id: string;
    task: ITaskDefinition;
    tile_id: string;
    resolved_script: string;
    resolved_script_args: string;
    max_cpu: number;
    max_memory: number;
    submitted_at: string;
    started_at: string;
    last_process_status_code: ExecutionStatus;
}

export interface ITaskExecution {
    id: string;
    worker_id: string;
    tile_id: string;
    task_definition_id: string;
    task: ITaskDefinition;
    pipeline_stage_id: string;
    local_work_units: number;
    cluster_work_units: number;
    resolved_script: string;
    resolved_interpreter: string;
    resolved_script_args: string;
    resolve_log_path: string;
    last_process_status_code: number;
    completion_status_code: number;
    execution_status_code: number;
    exit_code: number;
    max_cpu: number;
    max_memory: number;
    started_at: number;
    completed_at: number;
}
