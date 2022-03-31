import themes from "./themes.js";
import cursors from "./cursors.js";
import { generateTeam } from "./generators.js";
import GamePlay from "./GamePlay.js";
import GameState from "./GameState.js";
import PositionedCharacter from "./PositionedCharacter.js";
import Character from "./Character.js";
import Bowman from "./bowman.js";
import Magician from "./magician.js";
import Swordsman from "./swordsman.js";
import Undead from "./undead.js";
import Vampire from "./vampire.js";
import Daemon from "./daemon.js";

export default class GameController {
  constructor(GamePlay, stateService) {
    this.GamePlay = GamePlay;
    this.stateService = stateService;
    this.position = [];
    this.teamComputer;
    this.teamGamer;
    this.arrayClassGamer = [Bowman, Swordsman, Magician];
    this.arrayClassComputer = [Undead, Vampire, Daemon];
    this.player;
    this.scores = 0;
    this.characterClick;
    this.characterEnter;
    this.characterMove = [];
    this.characterAttack = [];
    this.left = [0, 8, 16, 24, 32, 40, 48, 56];
    this.right = [7, 15, 23, 31, 39, 47, 55, 63];
    this.level = 1;
    this.poccibleCells = [];
    this.enter = -1;
    this.click = -1;
    this.randomGamer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.randomComp = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
  }

  init() {
    this.GamePlay.drawUi(themes.prairie);
    this.GamePlay.redrawPositions(this.generateGamerPos(this.randomGamer, this.arrayClassGamer));
    this.GamePlay.redrawPositions(this.generateGamerPos(this.randomComp, this.arrayClassComputer));
    this.GamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.GamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.GamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.GamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.GamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.GamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  onNewGameClick() {
    this.position = [];
    this.GamePlay.drawUi(themes.prairie);
    this.GamePlay.redrawPositions(this.generateGamerPos(this.randomGamer, this.arrayClassGamer));
    this.GamePlay.redrawPositions(this.generateGamerPos(this.randomComp, this.arrayClassComputer));
    this.level = 1;
    this.scores = 0;
    this.teamComp = [];
    this.teamGamer = [];
    this.click = -1;
    this.enter = -1;
    this.player = 1;
  }

  onSaveGameClick() {
    const saved = {
      position: this.position,
      player: this.player,
      level: this.level,
      scores: this.scores
    };
    this.stateService.save(GameState.from(saved));
    GamePlay.showMessage('Игра сохранена');
  }

  generateGamerPos(characterRandom, arrayCharacter) {
    let team = generateTeam(arrayCharacter, 1, 2);
    for (let character of team) {
      this.position.push(new PositionedCharacter(character, this.randomPosition(characterRandom)))
    }

    return this.position;
  }

  randomPosition(random) {
    let number = random[Math.floor(Math.random() * random.length)];
    while (this.checkPosition(number)) {
      number = random[Math.floor(Math.random() * random.length)];
    }
    return number;
  }

  checkPosition(number) {
    for (let pos of this.position) {
      if (number === pos.position) {
        ;
        return true;
      }
    }
    return false;
  }

  onLoadGameClick() {
    const load = this.stateService.load();
    if (load) {
      this.position = load.position;
      this.player = load.player;
      this.level = load.level;
      this.scores = load.scores;
    }
    switch (load.level) {
      case 1:
        this.GamePlay.drawUi('prairie');
        break;
      case 2:
        this.GamePlay.drawUi('desert');
        break;
      case 3:
        this.GamePlay.drawUi('arctic');
        break;
      case 4:
        this.GamePlay.drawUi('mountain');
        break;
    }
    this.GamePlay.redrawPositions(this.position);
  }

  onCellClick(index) {
    if (this.click != -1) {
      this.GamePlay.deselectCell(this.click);
    };

    if (this.position.find(cell => cell.position === index)) {
      let click = this.position.find(cell => cell.position === index);
      if (this.arrayClassGamer.includes(click.character.type)) {
        this.characterClick = click;
        this.GamePlay.selectCell(index);
        this.click = index;
      };

      if (this.arrayClassComputer.includes(click.character.type)) {
        this.attackEnemy(index, click);
        this.player = 1;
      };
    } else {
      GamePlay.showError('Так нельзя');
    }
  }

  onCellEnter(index) {
    let iconLevel = '\u{1F396}';
    let iconAttack = '\u{2694}';
    let icondefence = '\u{1F6E1}';
    let iconHealth = '\u{2764}';

    if (this.enter != -1) {
      this.GamePlay.deselectCell(this.enter);
    }

    this.GamePlay.setCursor(cursors.pointer);

    if (this.position.find(cell => cell.position === index)) {
      this.characterEnter = this.position.find(cell => cell.position === index);
      const character = this.characterEnter.character;
      if (character.type == "magician" || character.type == "bowman" || character.type == "swordsman") {
        let status = `${iconLevel}${character.level}${iconAttack}${character.attack}${icondefence}${character.defence}${iconHealth}${character.health}`;
        this.GamePlay.showCellTooltip(status, index);
      }
    } else {
      this.characterEnter = { position: -1, character: { type: 'none' } };
    };
    if (this.characterClick) {
      this.possibleCells = this.getMove(this.characterClick);
    }

    if (this.characterMove.indexOf(this.characterEnter.position) == -1 && this.characterMove.indexOf(index) != -1) {
      this.GamePlay.selectCell(this.click);
      this.GamePlay.setCursor(cursors.pointer);
      this.GamePlay.selectCell(index, 'green');
    };

    if (this.characterClick) {
      this.characterAttack = this.getAttack(this.characterClick);
    }
    if (this.characterEnter.character.type == "undead" || this.characterEnter.character.type == "vampire" || this.characterEnter.character.type == "daemon") {
      this.GamePlay.selectCell(this.click);
      if (this.characterAttack.indexOf(this.characterEnter.position) == -1) {
        this.GamePlay.setCursor(cursors.notallowed);
      } else {
        this.GamePlay.setCursor(cursors.crosshair);
        this.GamePlay.selectCell(index, "red");
      }
    };

    this.enter = index;
  }

  onCellLeave(index) {
    this.GamePlay.hideCellTooltip(index);
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

  computerRunning() { //компьютер
    this.GamePlay.deselectCell(this.click);
    this.click = -1;

    this.showWin();

    let attackGamer;

    let gamerActiveAttack = this.teamComp.find(item => {
      this.characterAttack = this.getAttack(item);
      attackGamer = this.teamGamer.find(item => this.characterAttack.indexOf(item.position) != -1)
      return attackGamer;
    });

    if (gamerActiveAttack) {
      this.GamePlay.selectCell(gamerActiveAttack.position);
      const damageHealth = Math.max(gamerActiveAttack.character.attack - attackGamer.character.defence, gamerActiveAttack.character.attack * 0.1);
      let damage = this.GamePlay.showDamage(attackGamer.position, damageHealth);
      damage.then((response) => {
        attackGamer.character.health -= damageHealth;
        if (attackGamer.character.health < 0) {
          this.position = this.position.filter(item => item != attackGamer);
          this.showWin();
        };

        this.GamePlay.deselectCell(gamerActiveAttack.position);
        this.GamePlay.redrawPositions(this.position);

      }, (err) => {
        console.log(err);
      })
    } else {
      let active = this.teamComp[Math.floor(Math.random() * Math.floor(this.teamComp.length))];
      this.characterMove = this.getMove(active);
      let pos = this.randomPosition(this.characterMove);
      this.GamePlay.deselectCell(active.position);
      active.position = pos;
      this.GamePlay.redrawPositions(this.position);
    }
  }

  showWin() {
    this.teamComputer = this.position.filter(item => item.character.type == "undead" || item.character.type == "daemon" || item.character.type == "vampire");
  
    this.teamGamer = this.position.filter(item => item.character.type == "bowman" || item.character.type == "magician" || item.character.type == "swordsman");
 
    if (this.teamComputer.length === 0) {
      this.level += 1;

      for (let char of this.teamGamer) {
        this.scores += char.character.health;
      }
      for (let char of this.teamGamer) {
        char.position = this.randomPosition(this.randomGamer);
      };

      this.teamGamer.forEach((elem) => Character.levelUp.call(elem.character));

      this.showNewLevel(this.teamGamer);
    };
    if (this.teamGamer.length === 0) {

      this.GamePlay.cellEnterListeners = [];
      this.GamePlay.cellLeaveListeners = [];
      this.GamePlay.cellClickListeners = [];
      GamePlay.showMessage(`Вы проиграли...`);
    }
  }

  changePosition(index) {
    this.position.forEach(pos => {
      if (pos.position == this.characterClick.position && this.characterMove.indexOf(index) != -1) {
        pos.position = index;
        this.GamePlay.redrawPositions(this.position);
        this.computerRunning();
      }
    });
  }
}



