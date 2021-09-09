import { Plugin } from "unified";
import { Node } from "unist";
import { inspect } from "unist-util-inspect";

const print: Plugin = () => {
  return (tree: Node) => {
    console.log(inspect(tree));
  };
};

export default print;
