'use strict';
import Character from './Character.js';

export default class Swordsman extends Character {
  constructor(name, type = 'swordsman') {
      super(name, type);
    this.attack = 40;
      this.defence = 10;
  }
}
