'use strict';
import Character from './Character.js';

export default class Vampire extends Character {
  constructor(name, type = 'vampire') {
      super(name, type);
    this.attack = 25;
      this.defence = 25;
  }
}
