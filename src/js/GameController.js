import themes from "./themes.js";
import cursors from "./cursors.js";
import { generateTeam } from "./generators.js";
import GamePlay from "./GamePlay.js";
import GameState from "./GameState.js";
import PositionedCharacter from "./PositionedCharacter.js";
import Character from "./Character.js";
import Bowman from "./Bowman.js";
import Magician from "./Magician.js";
import Swordsman from "./Swordsman.js";
import Undead from "./Undead.js";
import Vampire from "./Vampire.js";
import Daemon from "./Daemon.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.arrayClassGamer = ['Bowman', 'Magician', 'Swordsman'];
    this.arrayClassComputer = ['Undead', 'Vampire', 'Daemon'];
    this.randomGamer = [];
    this.randomComputer = [];
    this.position = [];
    this.teamComputer;
    this.teamGamer;
    this.player;
    this.poccibleCells = [];
    this.enter = -1;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions(this.generateGamer(this.randomGamer, this.arrayClassGamer));
    this.gamePlay.redrawPositions(this.generateGamer(this.randomComputer, this.arrayClassComputer));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  onCellClick(index) {
    if (this.click != -1) {
      this.gamePlay.deselectCell(this.click);
    };

    if (this.position.find(cell => cell.position === index)) {
      let click = this.position.find(cell => cell.position === index);

      if (this.arrayClassGamer.includes(click.character.type)) {
        this.characterClick = click;
        this.gamePlay.selectCell(index);
        this.click = index;
      };

      if (this.arrayClassComputer.includes(click.character.type)) {
        this.clickEnemy(index, click);
        this.player = 1;
      };
    } else {
      this.gamePlay.showError();
    }
  }

  onCellEnter(index) {
    let iconLevel = '\u{1F396}';
    let iconAttack = '\u{2694}';
    let icondefence = '\u{1F6E1}';
    let iconHealth = '\u{2764}';

    if (this.enter != -1) {
      this.gamePlay.deselectCell(this.enter);
    }

    this.gamePlay.setCursor(cursors.pointer);

    if (this.position.find(cell => cell.position === index)) {
      this.characterEnter = this.position.find(cell => cell.position === index);
      const character = this.characterEnter.character;
      if (character.type == "magician" || character.type == "bowman" || character.type == "swordsman") {
        let status = `${iconLevel}${character.level}${iconAttack}${character.attack}${icondefence}${character.defence}${iconHealth}${character.health}`;
        this.gamePlay.showCellTooltip(status, index);
      }
    } else {
      this.characterEnter = { position: -1, character: { type: 'none' } };
    };

    this.possibleCells = this.getMove(this.characterClick);

    if (this.characterMove.indexOf(this.characterEnter.position) == -1 && this.characterMove.indexOf(index) != -1) {
      this.gamePlay.selectCell(this.click);
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    };

    this.characterAttack = this.getAttack(this.characterClick);
    if (this.characterEnter.character.type == "undead" || this.characterEnter.character.type == "vampire" || this.characterEnter.character.type == "daemon") {
      this.gamePlay.selectCell(this.click);
      if (this.characterAttack.indexOf(this.characterEnter.position) == -1) {
        this.gamePlay.setCursor(cursors.notallowed);
      } else {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, "red");
      }
    };

    this.enter = index;
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  getMove(char) { //узнаем, на какие клетки распространяется ход
    if (char.character.type == 'undead' || char.character.type == 'swordsman') {
      return this.getPossible(4, char.position);
    } else if (char.character.type == 'bowman' || char.character.type == 'vampire') {
      return this.getPossible(2, char.position);
    } else {
      return this.getPossible(1, char.position);
    }
  }

  getAttack(char) {
    if (char.character.type == 'undead' || char.character.type == 'swordsman') {
      return this.getPossible(1, char.position);
    } else if (char.character.type == 'bowman' || char.character.type == 'vampire') {
      return this.getPossible(2, char.position);
    } else {
      return this.getPossible(4, char.position);
    }
  }

  getPossible(rad, pos) {
    for (let i = 0; i <= rad; i++) {
      if ((Math.floor((pos - i) / 8)) == Math.floor(pos / 8)) {
        for (let j = 0; j <= rad; j++) {
          possible.push(pos - i - j * 8);
          possible.push(pos - i + j * 8);
        }
      }
      if ((Math.floor((pos + i) / 8)) == Math.floor(pos / 8)) {
        for (let j = 0; j <= rad; j++) {
          possible.push(pos + i - j * 8);
          possible.push(pos + i + j * 8);
        }
      }
    }
    possible = Array.from(new Set(possible));
    possible = possible.filter(item => item >= 0 && item < 64);
    return possible;
  }
}
