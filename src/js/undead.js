'use strict';
import Character from './Character.js';

export default class Undead extends Character {
  constructor(name, type = 'undead') {
      super(name, type);
    this.attack = 40;
    this.defence = 10;
  }
}
