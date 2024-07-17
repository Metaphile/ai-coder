export type MyAgent = {
  invoke: (input: string) => Promise<Record<string, any>>;
};
