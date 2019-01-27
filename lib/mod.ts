// These snippets are taken from the source to bypass the NPM system, and allow Deno support.

// Taken from https://github.com/chalk/strip-ansi/blob/master/index.js
const ansiPatterns = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
].join('|');

const ansiRegex = new RegExp(ansiPatterns, 'g');

// Taken from https://github.com/kevva/astral-regex/blob/master/index.js
const astralRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

// Taken from https://github.com/sindresorhus/string-length/blob/master/index.js
function stringLength(str: string): number {
  return str.replace(ansiRegex, '').replace(astralRegex, ' ').length;
}

/**
 * The options to configure the formatting of the tree.
 */
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
  /**
   * Whether the text should be displayed inset into the guides or not.
   *
   * 0:
   * ```
   * first           | extra
   * ├── second      | another
   * ├─┬ third
   * │ ├── fourth    | yet
   * │ ├── fifth
   * │ └─┬ sixth     | another
   * │   ├── seventh | one
   * │   └─┬ eighth  | look
   * │     ├── ninth | another
   * │     └── tenth | one
   * └── eleventh    | yay
   * ```
   * 1:
   * ```
   * first             | extra
   * ├─ second         | another
   * ├─ third
   * │  ├─ fourth      | yet
   * │  ├─ fifth
   * │  └─ sixth       | another
   * │     ├─ seventh  | one
   * │     └─ eighth   | look
   * │        ├─ ninth | another
   * │        └─ tenth | one
   * └─ eleventh       | yay
   * ```
   * 2:
   * ```
   * first         | extra
   * ├ second      | another
   * ├ third
   * │ ├ fourth    | yet
   * │ ├ fifth
   * │ └ sixth     | another
   * │   ├ seventh | one
   * │   └ eighth  | look
   * │     ├ ninth | another
   * │     └ tenth | one
   * └ eleventh    | yay
   * ```
   */
  inset?: number;
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
export function formatTreeString(tree: TreeNode | TreeNode[], options?: Options): string {
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
  const inset = options.inset || 0;

  // Process nodes function.
  const processNodes = (nodes: TreeNode[], prefix: string) => {
    for (let i = 0; i < nodes.length; i++) {
      // Shorthands.
      const node = nodes[i];

      // Set up guide for current node.
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
          guide = '└';
        } else {
          guide = '├';
        }
      }
      if (inset !== 2) {
        guide += '─';
        if (inset !== 1) {
          if (hasChildren) {
            guide += '┬';
          } else {
            guide += '─';
          }
        }
      }
      guide += ' ';

      // Apply format function.
      if (options.guideFormat) {
        guide = options.guideFormat(guide);
      }

      // Build current line.
      toBuild.push({
        line: prefix + guide + node.text,
        extra: node.extra,
      });

      // Build children.
      if (hasChildren) {
        let nprefix = `${prefix}${last ? ' ' : '│'} ${inset === 1 ? ' ' : ''}`;
        if (options.guideFormat) {
          nprefix = options.guideFormat(nprefix);
        }
        processNodes(
          node.children!,
          nprefix,
        );
      }
    }
  };

  // Start tree formatting.
  let tr: TreeNode[] | undefined;
  if (Array.isArray(tree)) {
    tr = tree;
  } else {
    toBuild.push({
      line: tree.text,
      extra: tree.extra,
    });
    tr = tree.children;
    shouldFirstCap = false;
  }
  if (tr) {
    processNodes(tr, '');
  }

  // Get the longest name so we can format the extra text occordingly.
  let maxLen = 0;
  for (const item of toBuild) {
    maxLen = Math.max(maxLen, stringLength(item.line));
  }

  // Add extra text and build full output.
  const output: string[] = [];
  const extraSplit = typeof options.extraSplit === 'undefined' ? ' | ' : options.extraSplit;
  for (const item of toBuild) {
    let line = item.line;
    if (item.extra) {
      line += `${' '.repeat(maxLen - stringLength(item.line))}${extraSplit}${item.extra}`;
    }
    output.push(line);
  }

  return output;
}
