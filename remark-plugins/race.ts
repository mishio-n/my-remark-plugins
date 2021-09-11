import { Plugin } from "unified";
import { Node, Parent } from "unist";
import { Paragraph } from "mdast";
import { isParent, isText, isParagraph } from "./util";
import visit from "unist-util-visit";
import { H } from "mdast-util-to-hast";
import all from "./all.js";

const RACE_PATTERN = /race (.) (\d+) (.+)$/;

function isRace(node: unknown): node is Paragraph {
  if (!isParagraph(node)) {
    return false;
  }
  console.log(node.children);

  const { children } = node;

  const firstChild = children[0];
  if (!(isText(firstChild) && firstChild.value.match(RACE_PATTERN))) {
    return false;
  }

  return true;
}

const processChild = (children: Array<Node>, regexp: RegExp) => {
  const firstChild = children[0];
  const firstValue = firstChild.value as string;
  const matched = firstValue.match(regexp);
  if (matched) {
    children[0] = {
      ...firstChild,
      value: `${matched[2]} ${matched[3]}`,
      symbol: matched[1],
    };
  }
};

const raceVisitor = (node: Paragraph, index: number, parent?: Parent) => {
  if (!isParent(parent)) {
    return;
  }

  const children = [...node.children];
  processChild(children, RACE_PATTERN);

  parent.children[index] = {
    type: "race",
    children,
  };
};

export const racePlugin: Plugin = () => {
  return (tree: Node) => {
    visit(tree, isRace, raceVisitor);
  };
};

export const raceHandler = (h: H, node: Node) => {
  // children が unknownになるため
  const children = node.children as {
    value: string;
    symbol: string;
  }[];

  const symbol = (() => {
    switch (children[0].symbol) {
      case "◎":
        return "honmei";
      case "○":
        return "taikou";
      case "▲":
        return "tanana";
      case "△":
        return "renshita";
      default:
        return "";
    }
  })();

  return {
    type: "element",
    tagName: "div",
    properties: {
      className: ["race", symbol],
    },
    children: all(h, node),
  };
};
