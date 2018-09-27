import { formatTreeString, Options, TreeNode } from '../src';
import chalk from 'chalk';

function testTree(tree: TreeNode | TreeNode[], options?: Options) {
  // tslint:disable-next-line:no-console
  console.log(formatTreeString(tree, options));
}

testTree({
  text: 'first'
});

testTree({
  text: 'first',
  extra: 'extra'
});

testTree({
  text: 'first',
  extra: 'extra',
  children: []
});

testTree({
  text: 'first',
  extra: 'extra',
  children: [
    {
      text: 'second'
    }
  ]
});

testTree({
  text: 'first',
  extra: 'extra',
  children: [
    {
      text: 'second',
      extra: 'another'
    }
  ]
});

testTree(
  {
    text: 'first',
    extra: 'extra',
    children: [
      {
        text: 'second',
        extra: 'another'
      }
    ]
  },
  {
    guideFormat: chalk.dim,
    extraSplit: '/'
  }
);

testTree(
  {
    text: 'first',
    extra: 'extra',
    children: [
      {
        text: 'second',
        extra: 'another'
      }
    ]
  },
  {
    guideFormat: chalk.dim,
    extraSplit: ' '
  }
);

testTree(
  {
    text: 'first',
    extra: 'extra',
    children: [
      {
        text: 'second',
        extra: 'another'
      },
      {
        text: 'third',
        children: [
          {
            text: 'fourth',
            extra: 'yet'
          },
          {
            text: 'fifth'
          },
          {
            text: 'sixth',
            extra: 'another',
            children: [
              {
                text: 'seventh',
                extra: 'one'
              },
              {
                text: 'eighth',
                extra: 'look',
                children: [
                  {
                    text: 'ninth',
                    extra: 'another'
                  },
                  {
                    text: 'tenth',
                    extra: 'one'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        text: 'eleventh',
        extra: 'yay'
      }
    ]
  },
  {
    guideFormat: chalk.dim
  }
);

testTree(
  [
    {
      text: 'first',
      extra: 'extra'
    },
    {
      text: 'second',
      extra: 'another'
    },
    {
      text: 'third',
      children: [
        {
          text: 'fourth',
          extra: 'yet'
        },
        {
          text: 'fifth'
        },
        {
          text: 'sixth',
          extra: 'another',
          children: [
            {
              text: 'seventh',
              extra: 'one'
            },
            {
              text: 'eighth',
              extra: 'look',
              children: [
                {
                  text: 'ninth',
                  extra: 'another'
                },
                {
                  text: 'tenth',
                  extra: 'one'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      text: 'eleventh',
      extra: 'yay'
    }
  ],
  {
    guideFormat: chalk.dim
  }
);

testTree(
  [
    {
      text: 'first',
      extra: 'extra'
    }
  ],
  {
    guideFormat: chalk.dim
  }
);

testTree(
  [
    {
      text: 'first',
      extra: 'extra'
    },
    {
      text: 'second',
      extra: 'another'
    },
    {
      text: 'third',
      children: [
        {
          text: 'fourth',
          extra: 'yet'
        },
        {
          text: 'fifth'
        },
        {
          text: 'sixth',
          extra: 'another',
          children: [
            {
              text: 'seventh',
              extra: 'one'
            },
            {
              text: 'eighth',
              extra: 'look',
              children: [
                {
                  text: 'ninth',
                  extra: 'another'
                },
                {
                  text: 'tenth',
                  extra: 'one'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      text: 'eleventh',
      extra: 'yay'
    }
  ],
  {
    guideFormat: chalk.dim,
    inset: 1
  }
);

testTree(
  [
    {
      text: 'first',
      extra: 'extra'
    },
    {
      text: 'second',
      extra: 'another'
    },
    {
      text: 'third',
      children: [
        {
          text: 'fourth',
          extra: 'yet'
        },
        {
          text: 'fifth'
        },
        {
          text: 'sixth',
          extra: 'another',
          children: [
            {
              text: 'seventh',
              extra: 'one'
            },
            {
              text: 'eighth',
              extra: 'look',
              children: [
                {
                  text: 'ninth',
                  extra: 'another'
                },
                {
                  text: 'tenth',
                  extra: 'one'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      text: 'eleventh',
      extra: 'yay'
    }
  ],
  {
    guideFormat: chalk.dim,
    inset: 2
  }
);
