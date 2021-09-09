import { Plugin } from "unified";
import { Node, Parent } from "unist";
import { Paragraph } from "mdast";
import { isParent, isText, isParagraph } from "./util";
import visit from "unist-util-visit";
import { H } from "mdast-util-to-hast";
import all from "./all.js";

const INFO_BEGGINING = ":::note info\n";
const WARN_BEGGINING = ":::note warn\n";
const ALERT_BEGGINING = ":::note alert\n";
const ENDING = "\n:::";

function isAdmonitionInfo(node: unknown): node is Paragraph {
  if (!isParagraph(node)) {
    return false;
  }

  const { children } = node;

  const firstChild = children[0];
  if (!(isText(firstChild) && firstChild.value.startsWith(INFO_BEGGINING))) {
    return false;
  }

  const lastChild = children[children.length - 1];
  if (!(isText(lastChild) && lastChild.value.endsWith(ENDING))) {
    return false;
  }

  return true;
}

function isAdmonitionAlert(node: unknown): node is Paragraph {
  if (!isParagraph(node)) {
    return false;
  }

  const { children } = node;

  const firstChild = children[0];
  if (!(isText(firstChild) && firstChild.value.startsWith(ALERT_BEGGINING))) {
    return false;
  }

  const lastChild = children[children.length - 1];
  if (!(isText(lastChild) && lastChild.value.endsWith(ENDING))) {
    return false;
  }

  return true;
}

function isAdmonitionWarn(node: unknown): node is Paragraph {
  if (!isParagraph(node)) {
    return false;
  }

  const { children } = node;

  const firstChild = children[0];
  if (!(isText(firstChild) && firstChild.value.startsWith(WARN_BEGGINING))) {
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

const infoVisitor = (node: Paragraph, index: number, parent?: Parent) => {
  if (!isParent(parent)) {
    return;
  }

  const children = [...node.children];
  processFirstChild(children, INFO_BEGGINING);
  processLastChild(children, ENDING);

  parent.children[index] = {
    type: "info",
    children,
  };
};

export const admonitionInfo: Plugin = () => {
  return (tree: Node) => {
    visit(tree, isAdmonitionInfo, infoVisitor);
  };
};

const warnVisitor = (node: Paragraph, index: number, parent?: Parent) => {
  if (!isParent(parent)) {
    return;
  }

  const children = [...node.children];
  processFirstChild(children, WARN_BEGGINING);
  processLastChild(children, ENDING);

  parent.children[index] = {
    type: "warn",
    children,
  };
};

export const admonitionWarn: Plugin = () => {
  return (tree: Node) => {
    visit(tree, isAdmonitionWarn, warnVisitor);
  };
};

const alertVisitor = (node: Paragraph, index: number, parent?: Parent) => {
  if (!isParent(parent)) {
    return;
  }

  const children = [...node.children];
  processFirstChild(children, ALERT_BEGGINING);
  processLastChild(children, ENDING);

  parent.children[index] = {
    type: "alert",
    children,
  };
};

export const admonitionAlert: Plugin = () => {
  return (tree: Node) => {
    visit(tree, isAdmonitionAlert, alertVisitor);
  };
};

export const admonitionAlertHandler = (h: H, node: Node) => ({
  type: "element",
  tagName: "div",
  properties: {
    className: ["note", "alert"],
  },
  children: all(h, node),
});

export const admonitionWarnHandler = (h: H, node: Node) => ({
  type: "element",
  tagName: "div",
  properties: {
    className: ["note", "warn"],
  },
  children: all(h, node),
});

export const admonitionInfoHandler = (h: H, node: Node) => ({
  type: "element",
  tagName: "div",
  properties: {
    className: ["note", "info"],
  },
  children: all(h, node),
});
