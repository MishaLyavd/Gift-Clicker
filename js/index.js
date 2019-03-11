const NAME_BLOCK = document.getElementById('nameboard');
const DATE_BLOCK = document.getElementById('dateboard');
const POPULATION_BLOCK = document.getElementById('populationboard');
const SCORE_BLOCK = document.getElementById('scoreboard');
const MINE_BLOCK = document.getElementById('mineLvlUp');
const CLICK_BLOCK = document.getElementById('clickLvlUp');
const VILLAGE_BLOCK = document.getElementById('villageLvlUp');
const GIFT_BLOCK = document.getElementById('giftButton');
const BEFORE_BLOCK = document.getElementById('valueBefore');
const AFTER_BLOCK = document.getElementById('valueAfter');
const SCORE_CHEAT_BLOCK = document.getElementById('scoreCheat');
const DAY_CHEAT_BLOCK = document.getElementById('dayCheat');
const oneStars = 1000000;
const twoStars = 2000000;
const threeStars = 3000000;
var userName;
var score = 0;
var currentDay = 1;
var lvlOfMine = 0;
var lvlOfClick = 0;
var lvlOfVillage = 1;
var mineProfit;
var clickProfit;
var priceOfMine;
var priceOfClick;
var priceOfVillage;
var giftTimerId;

addListeners();

function startGame() {
  NAME_BLOCK.textContent = userName;
  refreshValues().refreshDate();
  refreshValues().refreshPopulation();
  refreshValues().refreshScore();
  refreshValues().refreshMine();
  refreshValues().refreshClick();
  refreshValues().refreshVillage();
  showInfo().showClickInfo();
  addPoints().mineProfitOverTime();
  animaster().skyStart();
  countDays().timer();
}

function addListeners() {
    document.getElementById('userSubmit')
        .addEventListener('click', function () {
            userName = document.getElementById('userName').value;
            document.getElementById('blackScreen').classList.add('_hidden');
            document.getElementById('userName').classList.add('_hidden');
            document.getElementById('userSubmit').classList.add('_hidden');
            nameCurrection(userName);
            startGame();
    });

    GIFT_BLOCK.addEventListener('click', function () {
        addPoints().addClickProfit();
        animaster().addJump(GIFT_BLOCK);
    });

    SCORE_CHEAT_BLOCK.addEventListener('click', function () {
        score += 1000000;
        refreshValues().refreshScore();
    });

    DAY_CHEAT_BLOCK.addEventListener('click', function () {
        currentDay = 30;
        refreshValues().refreshDate();
    });

    MINE_BLOCK.addEventListener('click', function () {
        if (score >= priceOfMine && lvlOfMine < lvlOfVillage) {
          score -= priceOfMine;
          lvlOfMine++;
          refreshValues().refreshScore();
          refreshValues().refreshMine();
          refreshValues().refreshPopulation();
          showInfo().showMineInfo();
          showObjects().showElf();
        }
    });

    CLICK_BLOCK.addEventListener('click', function () {
        if (score >= priceOfClick) {
          score -= priceOfClick;
          lvlOfClick++;
          refreshValues().refreshScore();
          refreshValues().refreshClick();
          showInfo().showClickInfo();
        }
    });

    VILLAGE_BLOCK.addEventListener('click', function () {
        if (score >= priceOfVillage) {
          score -= priceOfVillage;
          lvlOfVillage++;
          refreshValues().refreshScore();
          refreshValues().refreshVillage();
          refreshValues().refreshPopulation();
          showInfo().showVillageInfo();
          showObjects().showHouse();
        }
    });

    MINE_BLOCK.addEventListener('mouseover', function () {
        animaster().activate(MINE_BLOCK);
        animaster().deactivate(CLICK_BLOCK);
        animaster().deactivate(VILLAGE_BLOCK);
        showInfo().showMineInfo();
    });

    CLICK_BLOCK.addEventListener('mouseover', function () {
        animaster().activate(CLICK_BLOCK);
        animaster().deactivate(MINE_BLOCK);
        animaster().deactivate(VILLAGE_BLOCK);
        showInfo().showClickInfo();
    });

    VILLAGE_BLOCK.addEventListener('mouseover', function () {
        animaster().activate(VILLAGE_BLOCK);
        animaster().deactivate(MINE_BLOCK);
        animaster().deactivate(CLICK_BLOCK);
        showInfo().showVillageInfo();
    });
}

function addPoints() {
  return {
    mineProfitOverTime: function() {
        setTimeout(() => {
          this.addMineProfit();
        }, 1000);
        setTimeout(() => {
          this.mineProfitOverTime();
        }, 1000);
    },
    addClickProfit: function() {
      score += clickProfit;
      refreshValues().refreshScore();
    },
    addMineProfit: function() {
      score += mineProfit;
      refreshValues().refreshScore();
    }
  }
}

function countProfits() {
  return {
    countMine: function(lvl) {
      if (lvl === 0) {
        return 0;
      }
      return roundPlus(2 * Math.pow(1.2, lvl));
    },
    countClick: function(lvl) {
      return roundPlus(1 * Math.pow(1.08, lvl));
    }
  }
}

function countPrices() {
  return {
    countMine: function() {
      return priceOfMine = Math.round(25 * Math.pow(1.5, lvlOfMine));
    },
    countClick: function() {
      return priceOfClick = Math.round(10 * Math.pow(1.15, lvlOfClick));
    },
    countVillage: function() {
      return priceOfVillage = Math.round(50 * Math.pow(1.19, lvlOfVillage));
    }
  }
}

function refreshValues() {
  return {
    refreshDate: function() {
        DATE_BLOCK.textContent = currentDay;
    },
    refreshPopulation: function() {
        POPULATION_BLOCK.textContent = lvlOfMine + ' / ' + lvlOfVillage;
    },
    refreshScore: function() {
        SCORE_BLOCK.textContent = Math.floor(score);
    },
    refreshMine: function() {
        mineProfit = countProfits().countMine(lvlOfMine);
        MINE_BLOCK.textContent = countPrices().countMine();
    },
    refreshClick: function() {
        clickProfit = countProfits().countClick(lvlOfClick);
        CLICK_BLOCK.textContent = countPrices().countClick();
    },
    refreshVillage: function() {
        VILLAGE_BLOCK.textContent = countPrices().countVillage();
    }
  }
}

function showInfo() {
  return {
    showMineInfo: function() {
        BEFORE_BLOCK.textContent = 'Сейчас: ' + mineProfit;
        AFTER_BLOCK.textContent = 'Будет: ' + countProfits().countMine(lvlOfMine + 1);
    },
    showClickInfo: function() {
        BEFORE_BLOCK.textContent = 'Сейчас: ' + clickProfit;
        AFTER_BLOCK.textContent = 'Будет: ' + countProfits().countClick(lvlOfClick + 1);
    },
    showVillageInfo: function() {
        BEFORE_BLOCK.textContent = 'Сейчас: ' + lvlOfVillage;
        AFTER_BLOCK.textContent = 'Будет: ' + (lvlOfVillage + 1);
    }
  }
}

function showObjects() {
  return {
    showElf: function() {
      if (lvlOfMine <= 5) {
        let elf = 'elf' + lvlOfMine;
        document.getElementById(elf).classList.remove('_hidden');
        document.getElementById(elf).classList.add('_appearance');
      }
    },
    showHouse: function() {
      if (lvlOfVillage <= 5) {
        let house = 'house' + lvlOfVillage;
        document.getElementById(house).classList.remove('_hidden');
        document.getElementById(house).classList.add('_appearance');
      }
    }
  }
}

function animaster() {
  return {
    activate: function(element) {
      element.classList.add('_info-active');
    },
    deactivate: function(element) {
      element.classList.remove('_info-active');
    },
    addJump: function(element) {
      element.classList.remove('_gift-jump');
      clearTimeout(giftTimerId);
      element.classList.add('_gift-jump');
      giftTimerId = setTimeout(() => {
        this.removeJump(element);
      }, 300);
    },
    removeJump: function(element) {
      element.classList.remove('_gift-jump');
    },
    skyStart: function() {
      document.getElementById('sky').classList.add('_sky-play');
    }
  }
}

function countDays() {
  return {
    timer: function() {
      setTimeout(this.addDay, 30000);
    },
    addDay: function() {
      currentDay += 1;
      countDays().timer();
      refreshValues().refreshDate();
      if (currentDay >= 31) {
        chooseVictory();
      }
    }
  }
}

function chooseVictory() {
  document.getElementById('blackScreen').classList.remove('_hidden');
  document.getElementById('paper').classList.remove('_hidden');
  document.getElementById('congratulation').textContent = 'Дорогой ' + userName;
  if (score < oneStars) {
    return;
  }
  document.getElementById('wish1').classList.remove('_hidden');
  if (score < twoStars) {
    return;
  }
  document.getElementById('wish2').classList.remove('_hidden');
  if (score < threeStars) {
    return;
  }
  document.getElementById('wish3').classList.remove('_hidden');
  return;
}

function roundPlus(x) {
  if(isNaN(x)) return false;
  var m = Math.pow(10,2);
  return Math.round(x*m)/m;
}

function nameCurrection(name) {
  if (name === "") {
    userName = 'Аноним';
  }
}
