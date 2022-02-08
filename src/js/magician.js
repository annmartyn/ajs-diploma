'use strict';
import Character from './Character.js';

export default class Magician extends Character {
  constructor(name, type = 'Magician') {
      super(name, type);
    this.attack = 10;
    this.defence = 40;
  }
}
