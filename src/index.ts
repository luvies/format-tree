import stringLength from 'string-length';

export interface Options {
  /**
   * The function used to format the guides. Mainly used for adding
   * colours to the guides (e.g. using chalk).
   */
  guideFormat?: (guide: string) => string;
  /**
   * The split string to use to separate the tree and the extra string.
   * @default ' | '
   */
  extraSplit?: string;
}

export interface TreeNode {
  /**
   * The text for this node.
   */
  text: string;
  /**
   * The extra text to align to the right of the tree.
   */
  extra?: string;
  /**
   * The children nodes to add under this one.
   */
  children?: TreeNode[];
}

/**
 * Formats the tree into a single string, each line split by \n.
 *
 * @param tree The tree to format into a string.
 * @param options The options to pass to the formatter.
 * @returns The formatted string.
 */
export function formatTreeString(tree: TreeNode | TreeNode[], options?: Options) {
  return formatTree(tree, options).join('\n');
}

/**
 * Formats the tree into a list of string, each item in the list a single line.
 *
 * @param tree The tree to format into a string.
 * @param options The options to pass to the formatter.
 * @returns The formatted lines.
 */
export function formatTree(tree: TreeNode | TreeNode[], options: Options = {}): string[] {
  const toBuild: Array<{ line: string, extra?: string }> = [];
  let shouldFirstCap = true;

  // process nodes function
  const processNodes = (nodes: TreeNode[], prefix: string) => {
    for (let i = 0; i < nodes.length; i++) {
      // shorthands
      const node = nodes[i];

      // set up guide for current node
      let guide: string;
      const last = i === nodes.length - 1;
      const hasChildren = node.children && node.children.length;
      if (shouldFirstCap) {
        if (last) {
          guide = '─';
        } else {
          guide = '┌';
        }
        shouldFirstCap = false;
      } else {
        if (last) {
          guide = '└─';
        } else {
          guide = '├─';
        }
      }
      if (hasChildren) {
        guide += '┬';
      } else {
        guide += '─';
      }
      guide += ' ';

      // apply format function
      if (options.guideFormat) {
        guide = options.guideFormat(guide);
      }

      // build current line
      toBuild.push({
        line: prefix + guide + node.text,
        extra: node.extra
      });

      // build children
      if (hasChildren) {
        let nprefix = prefix + (last ? ' ' : '│') + ' ';
        if (options.guideFormat) {
          nprefix = options.guideFormat(nprefix);
        }
        processNodes(
          node.children!,
          nprefix
        );
      }
    }
  };

  // start tree formatting
  let tr: TreeNode[] | undefined;
  if (Array.isArray(tree)) {
    tr = tree;
  } else {
    toBuild.push({
      line: tree.text,
      extra: tree.extra
    });
    tr = tree.children;
    shouldFirstCap = false;
  }
  if (tr) {
    processNodes(tr, '');
  }

  // get the longest name so we can format the extra text occordingly
  let maxLen = 0;
  for (const item of toBuild) {
    maxLen = Math.max(maxLen, stringLength(item.line));
  }

  // add extra text and build full output
  const output: string[] = [];
  const extraSplit = typeof options.extraSplit === 'undefined' ? ' | ' : options.extraSplit;
  for (const item of toBuild) {
    let line = item.line;
    if (item.extra) {
      line += ' '.repeat(maxLen - stringLength(item.line)) + `${extraSplit}${item.extra}`;
    }
    output.push(line);
  }

  return output;
}
