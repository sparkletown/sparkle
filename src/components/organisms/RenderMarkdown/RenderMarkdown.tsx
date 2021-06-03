import React from "react";

import ReactMarkdown from "react-markdown";
import glm from "remark-gfm";
import emoji from "remark-emoji";
import externalLinks from "remark-external-links";
import sanitize from "rehype-sanitize";

import { isTruthy } from "utils/types";

const REMARK_PLUGINS = [glm, emoji, externalLinks];
const REHYPE_PLUGINS = [sanitize];

const MARKDOWN_BASIC_FORMATTING_TAGS = [
  "p",
  "strong",
  "em",
  "blockquote",
  "hr",
  "del",
];
const MARKDOWN_HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const MARKDOWN_IMAGE_TAGS = ["img"];
const MARKDOWN_LINK_TAGS = ["a"];
const MARKDOWN_LIST_TAGS = ["ol", "ul", "li"];
const MARKDOWN_PRE_CODE_TAGS = ["pre", "code"];

export interface RenderMarkdownProps {
  text?: string;
  allowBasicFormatting?: boolean;
  allowPreAndCode?: boolean;
  allowHeadings?: boolean;
  allowLinks?: boolean;
  allowImages?: boolean;
  allowLists?: boolean;
}

export const _RenderMarkdown: React.FC<RenderMarkdownProps> = ({
  text,
  allowBasicFormatting = true,
  allowPreAndCode = true,
  allowHeadings = true,
  allowLinks = true,
  allowImages = true,
  allowLists = true,
}) => {
  const allowedElements: string[] = [
    ...(allowBasicFormatting ? MARKDOWN_BASIC_FORMATTING_TAGS : []),
    ...(allowHeadings ? MARKDOWN_HEADING_TAGS : []),
    ...(allowImages ? MARKDOWN_IMAGE_TAGS : []),
    ...(allowLinks ? MARKDOWN_LINK_TAGS : []),
    ...(allowLists ? MARKDOWN_LIST_TAGS : []),
    ...(allowPreAndCode ? MARKDOWN_PRE_CODE_TAGS : []),
  ].filter(isTruthy);

  if (!text) return null;

  return (
    <ReactMarkdown
      remarkPlugins={REMARK_PLUGINS}
      rehypePlugins={REHYPE_PLUGINS}
      linkTarget="_blank"
      allowedElements={allowedElements}
    >
      {text}
    </ReactMarkdown>
  );
};

export const RenderMarkdown = React.memo(_RenderMarkdown);
