import React from "react";
import ReactMarkdown from "react-markdown";
import sanitize from "rehype-sanitize";
import emoji from "remark-emoji";
import externalLinks from "remark-external-links";
import glm from "remark-gfm";

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
  components?: object;
  allowBasicFormatting?: boolean;
  allowPreAndCode?: boolean;
  allowHeadings?: boolean;
  allowLinks?: boolean;
  allowImages?: boolean;
  allowLists?: boolean;
}

const _RenderMarkdownInner: React.FC<RenderMarkdownProps> = ({
  text,
  components,
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

  const checkIsLinkInternal = (link: string) => {
    const currentDomain = window.location.host;
    return link.includes(currentDomain);
  };

  const parseText = (text: string) => {
    const regex = /(.*|.*\n)(http[^\s]*)(.*)|(.*)/g;
    return Array.from(text.matchAll(regex));
  };

  return (
    <div>
      {parseText(text).map((match) =>
        match[4].length ? (
          <div key={match[2]}>
            {match[1].replace("/n", " ")}
            <ReactMarkdown
              remarkPlugins={REMARK_PLUGINS}
              rehypePlugins={REHYPE_PLUGINS}
              linkTarget={checkIsLinkInternal(match[2]) ? "_self" : "_blank"}
              allowedElements={allowedElements}
              components={components}
            >
              {match[2]}
            </ReactMarkdown>
            {match[3]}
          </div>
        ) : (
          <div>{match[4]}</div>
        )
      )}
    </div>
  );
};

export const RenderMarkdownInner = React.memo(_RenderMarkdownInner);
