'use strict';
import Character from './Character.js';

export default class Daemon extends Character {
  constructor(name, type = 'daemon') {
      super(name, type);
    this.attack = 10;
      this.defence = 40;
  }
}
