// @ts-ignore
import { formatTreeString } from '../lib/mod.ts';

// tslint:disable-next-line:no-console
console.log(formatTreeString({
  text: 'first',
  extra: 'extra',
  children: [
    {
      text: 'second',
      extra: 'another',
    },
  ],
}));
