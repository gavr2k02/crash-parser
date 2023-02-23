import { random } from 'lodash';

export function getTestObject(): TestObject {
  return {
    number: Math.random(),
    int: random(1000000),
    date: new Date(),
    string: Math.random().toString(),
  };
}

export type TestObject = {
  number: number;
  int: number;
  date: Date;
  string: string;
  nested?: TestObject;
};
