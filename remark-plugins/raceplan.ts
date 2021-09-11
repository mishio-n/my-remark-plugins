import { Plugin } from "unified";
import { Node, Parent } from "unist";
import { Paragraph } from "mdast";
import { isParent, isText, isParagraph } from "./util";
import visit from "unist-util-visit";
import { H } from "mdast-util-to-hast";
import all from "./all.js";

const BEGGINING = ":::raceplan\n";
const ENDING = "\n:::";

function isRaceplan(node: unknown): node is Paragraph {
  if (!isParagraph(node)) {
    return false;
  }

  const { children } = node;

  const firstChild = children[0];
  if (!(isText(firstChild) && firstChild.value.startsWith(BEGGINING))) {
    return false;
  }

  const lastChild = children[children.length - 1];
  if (!(isText(lastChild) && lastChild.value.endsWith(ENDING))) {
    return false;
  }

  return true;
}

const processFirstChild = (children: Array<Node>, identifier: string) => {
  const firstChild = children[0];
  const firstValue = firstChild.value as string;
  if (firstValue === identifier) {
    children.shift();
  } else {
    children[0] = {
      ...firstChild,
      value: firstValue.slice(identifier.length),
    };
  }
};

const processLastChild = (children: Array<Node>, identifier: string) => {
  const lastIndex = children.length - 1;
  const lastChild = children[lastIndex];
  const lastValue = lastChild.value as string;
  if (lastValue === identifier) {
    children.pop();
  } else {
    children[lastIndex] = {
      ...lastChild,
      value: lastValue.slice(0, lastValue.length - identifier.length),
    };
  }
};

const raceplanVisitor = (node: Paragraph, index: number, parent?: Parent) => {
  if (!isParent(parent)) {
    return;
  }

  const children = [...node.children];
  processFirstChild(children, BEGGINING);
  processLastChild(children, ENDING);

  parent.children[index] = {
    type: "raceplan",
    children,
  };
};

export const raceplanPlugin: Plugin = () => {
  return (tree: Node) => {
    visit(tree, isRaceplan, raceplanVisitor);
  };
};

export const raceplanHandler = (h: H, node: Node) => ({
  type: "element",
  tagName: "div",
  properties: {
    className: ["raceplan"],
  },
  children: all(h, node),
});
