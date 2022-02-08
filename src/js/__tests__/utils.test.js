import { calcTileType } from '../utils';

//
test('checking tile 0', () => {
  let position = calcTileType(0, 8);

  expect(position).toBe('top-left');
})

test('checking tile 7', () => {
  let position = calcTileType(7, 8);

  expect(position).toBe('top-right');
})

test('checking tile 19', () => {
  let position = calcTileType(19, 8);

  expect(position).toBe('center');
})

test('checking tile 63', () => {
  let position = calcTileType(63, 8);

  expect(position).toBe('bottom-right');
})

test('checking tile 15', () => {
  let position = calcTileType(15, 8);

  expect(position).toBe('right');
})
