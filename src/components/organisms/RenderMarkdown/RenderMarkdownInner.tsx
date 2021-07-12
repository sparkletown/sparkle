import React from "react";

import ReactMarkdown from "react-markdown";
import glm from "remark-gfm";
import emoji from "remark-emoji";
import externalLinks from "remark-external-links";
import sanitize from "rehype-sanitize";

import {
  MARKDOWN_BASIC_FORMATTING_TAGS,
  MARKDOWN_HEADING_TAGS,
  MARKDOWN_IMAGE_TAGS,
  MARKDOWN_LINK_TAGS,
  MARKDOWN_LIST_TAGS,
  MARKDOWN_PRE_CODE_TAGS,
} from "settings";

import { isTruthy } from "utils/types";

const REMARK_PLUGINS = [glm, emoji, externalLinks];
const REHYPE_PLUGINS = [sanitize];

export interface RenderMarkdownProps {
  text?: string;
  allowBasicFormatting?: boolean;
  allowPreAndCode?: boolean;
  allowHeadings?: boolean;
  allowLinks?: boolean;
  allowImages?: boolean;
  allowLists?: boolean;
}

const _RenderMarkdownInner: React.FC<RenderMarkdownProps> = ({
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

export const RenderMarkdownInner = React.memo(_RenderMarkdownInner);
