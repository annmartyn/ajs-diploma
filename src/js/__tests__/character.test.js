import Character from '../Character.js';
import Daemon from '../daemon.js';

test('create character - throw err', () => {
  expect(() => new Character(1, 'daemon')).toThrow(new Error('Error! Can not create Character'));
})

test('create type, not to throw err', () => {
  let d = new Daemon('Barry');
  expect(d.attack).toBe(10);
})

test('icon is right', () => {
  let daemon = new Daemon("Harry");
  let status = `${'\u{1F396}'}${daemon.level}${'\u{2694}'}${daemon.attack}${'\u{1F6E1}'}${daemon.defence}${'\u{2764}'}${daemon.health}`;
  let exp = '\u{1F396}Harry\u{2694}10\u{1F6E1}40\u{2764}50';

  expect(status).toBe(exp);
});
