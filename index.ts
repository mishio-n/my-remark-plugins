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
import { bettingHandler, bettingPlugin } from "./remark-plugins/betting";
import { raceHandler, racePlugin } from "./remark-plugins/race";
import { raceplanHandler, raceplanPlugin } from "./remark-plugins/raceplan";

const parseMarkdown = (markdown: string) =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(admonitionInfo)
    .use(admonitionWarn)
    .use(admonitionAlert)
    .use(racePlugin)
    .use(raceplanPlugin)
    .use(bettingPlugin)
    .use(remarkRehype, {
      handlers: {
        alert: admonitionAlertHandler,
        info: admonitionInfoHandler,
        warn: admonitionWarnHandler,
        race: raceHandler,
        raceplan: raceplanHandler,
        betting: bettingHandler,
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

const honmei = parseMarkdown("race ◎ 15 バメイ");
console.log(honmei);

const taikou = parseMarkdown("race ○ 15 バメイ");
console.log(taikou);

const tanana = parseMarkdown("race ▲ 15 バメイ");
console.log(tanana);

const renshita = parseMarkdown("race △ 15 バメイ");
console.log(renshita);

const raceplan = parseMarkdown(":::raceplan\nraceplan\n:::");
console.log(raceplan);

const betting = parseMarkdown(":::betting\nbetting\n:::");
console.log(betting);
