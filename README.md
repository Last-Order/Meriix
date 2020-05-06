# Meriix

Meriix is a multi-function GUI based on Electron.

## 任务定义
```TypeScript
class RecipeName extends BaseRecipe {
    /** 任务基本属性定义 */
    static get definition(): RecipeDefinition { }
    /** 任务是否适用 */
    static check(files: FileList): boolean { }
    /** 生成任务 */
    static generateTasks(files: FileList): Task[] { }
}
```

```TypeScript
interface RecipeDefinition {
    /** 任务名 */
    name: string;
    /** 描述 */
    description: string;
    /** 外部依赖模块名 */
    dependencies: string[];
}
```

```TypeScript
interface Task {
    /** 任务名 */
    name: string;
    /** 描述 */
    description: string;
    /** 外部依赖模块名 */
    dependencies: string[];
    /** 任务队列中显示名 */
    displayName: string;
    /** 输出文件路径 */
    output: string;
    /** 任务步骤 */
    steps: TaskStep[];
}
```

```TypeScript
type TaskStep = CustomFunctionStep | EncodeStep | PipeEncodeStep | MuxStep | ExecuteStep | DeleteStep;

interface BaseStep {
    /** 步骤名 */
    stepName: string;
}

/** 执行自定义函数 */
interface CustomFunctionStep extends BaseStep {
    type: "function";
    /** 自定义函数 将会被执行 */
    stepFunction: () => any | (() => Promise<any>);
}

/** 编码 */
interface EncodeStep extends BaseStep {
    type: "encode";
    /** 输入文件路径 */
    input: string;
    /** 输出文件路径 */
    output: string;
    /** 编码器额外参数 */
    settings: object;
}

/** 经过管道编码 */
interface PipeEncodeStep extends BaseStep {
    type: "pipe_encode";
    /** 管道名 */
    pipe: "avs" | "vs" | "smg";
    /** 输入文件路径 */
    input: string;
    /** 输出文件路径 */
    output: string;
    /** 编码器额外参数 */
    encoderSettings: object;
}

/** 混流 */
interface MuxStep extends BaseStep {
    type: "mux";
    /** 视频轨道列表 */
    videoTracks: VideoTrackArguments[];
    /** 音频轨道列表 */
    audioTracks: AudioTrackArguments[];
    /** 输出文件路径 */
    output: string;
}

interface VideoTrackArguments {
    /** 文件路径 */
    path: string;
}

interface AudioTrackArguments {
    /** 文件路径 */
    path: string;
}
```