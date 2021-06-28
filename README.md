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
    static generateTasks(files: FileList, options: Record<string, unknown>): Task[] { }
}
```

```TypeScript
interface RecipeDefinition {
    /** 标识符 */
    id: string;
    /** 任务名 */
    name: string;
    /** 描述 */
    description: string;
    /** 版本号 */
    version: string;
    /** 外部依赖模块名 */
    dependencies?: string[];
    /** 编码器白名单 */
    encoderWhitelist?: string[];
    /** 用户输入设置 */
    userOptions: RecipeUserOptionScheme[];
}
```

```TypeScript
interface RecipeUserOptionScheme {
    /** 选项名 */
    name: string;
    /** 选项显示名 */
    label: string;
    /** 选项类型 */
    type: 'select' | 'input' | 'checkbox';
    /** select 类型用 可选值列表 */
    values?: string[];
    /** 默认值 */
    defaultValue?: any;
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
    /** 编码器白名单 */
    encoderWhitelist: string[];
    /** 任务队列中显示名 */
    displayName: string;
    /** 输出文件路径 */
    output: string;
    /** 中间临时文件路径 */
    temporaryFilePaths?: string[];
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
    encoderSettings: object;
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
