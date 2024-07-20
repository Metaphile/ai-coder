import repl from "node:repl";

export const createCli = async (handleInput: (input: string) => Promise<any>) => {
  const myEval: repl.REPLEval = async (evalCmd, context, file, cb) => {
    const result = await handleInput(evalCmd);
    cb(null, `${result}`);
  };

  const myWriter: repl.REPLWriter = (output) => {
    return `${output}`;
  };
  
  repl.start({
    prompt: '> ',
    eval: myEval,
    writer: myWriter,
    useColors: true,
  });
};
