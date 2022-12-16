export type KyaStage = "prod" | "dev" | "local";

export interface RequestArgs {
  readonly path: string;
  readonly params?: readonly unknown[];
}

export interface KyaApi {
  url: string;
  disconnect(): Promise<any>;
  connect(): Promise<any>;
  request(req: RequestArgs): Promise<unknown>;
  on(
    event: "connected" | "disconnected",
    listener: (...args: any[]) => void
  ): this;
}