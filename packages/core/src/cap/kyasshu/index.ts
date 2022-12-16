import { KyaApi, RequestArgs } from "./types";
import { EventEmitter } from "events";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

export type KyaOptions = { url: string };

export class KyaConnector extends EventEmitter implements KyaApi {
  public url: string;

  constructor(protected options: string | KyaOptions) {
    super();
    if (typeof options === "string") {
      this.url = options;
    } else {
      this.url = options.url;
    }
  }

  public async connect(): Promise<any> {
    this.emit("connected");
  }

  public async disconnect(): Promise<any> {
    this.emit("disconnected");
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      // when authenticating to kya api
      // ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
    };
  }

  public async request(req: RequestArgs): Promise<unknown> {
    const params = req.params;
    const options: AxiosRequestConfig = {
      method: "get",
      url: `${this.url}/${req.path}`,
      headers: this.headers,
      ...(params && { params: Object.assign({}, ...params) }),
    };

    let resp: AxiosResponse;

    try {
      resp = await axios(options);
    } catch (error) {
      throw new Error((error as Error).message);
    }

    if(!(resp.status >= 200 && resp.status < 300)){
      throw new Error(`status: ${resp.status}, ${resp.statusText}`);
    }

    return resp.data;
  }

  public on(
    event: "connected" | "disconnected",
    listener: (...args: any[]) => void
  ): this {
    return super.on(event, listener);
  }
}