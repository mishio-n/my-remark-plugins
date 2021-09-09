import rehypeStringify from "rehype-stringify/lib";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import unified from "unified";
import {
  admonitionAlert,
  admonitionAlertHandler,
  admonitionInfo,
  admonitionInfoHandler,
  admonitionWarn,
  admonitionWarnHandler,
} from "./remark-plugins/admonition";

const parseMarkdown = (markdown: string) =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(admonitionInfo)
    .use(admonitionWarn)
    .use(admonitionAlert)
    .use(remarkRehype, {
      handlers: {
        alert: admonitionAlertHandler,
        info: admonitionInfoHandler,
        warn: admonitionWarnHandler,
      },
    })
    .use(rehypeStringify)
    .processSync(markdown)
    .toString();

const info = parseMarkdown(`:::note info\nhoge\n:::`);
console.log(info);

const warn = parseMarkdown(`:::note warn\nhoge\n:::`);
console.log(warn);

const alert = parseMarkdown(`:::note alert\nhoge\n:::`);
console.log(alert);
