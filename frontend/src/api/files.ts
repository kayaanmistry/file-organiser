import { call } from "./bridge";

export const ping = () => call<string>("ping");
