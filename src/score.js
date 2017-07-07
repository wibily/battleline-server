import {NUM_TROOP_VALUES} from './core';
import {List} from 'immutable';

const SKIRMISH_BONUS = 30;
const BATTALION_BONUS = 2 * SKIRMISH_BONUS;
const PHALANX_BONUS = 3 * SKIRMISH_BONUS;
const WEDGE_BONUS = 4 * SKIRMISH_BONUS;

export function getMaxScore(line, lanes) {
  const cardsPlayed = lanes.reduce((acc, lane) => {
    return acc.concat(lane.get('p1')).concat(lane.get('p2'));
  }, List());

  //[number, suite]
  if (line.size === 2) {
    const first = line.first();
    const second = line.get(1);

    const isSameSuite = first.get(1) === second.get(1);
    const numDifference = Math.abs(first.get(0) - second.get(0));
    const isConsecutivePossible = numDifference > 0 && numDifference <= 2;

    if (isSameSuite && isConsecutivePossible) {
      let cardsToFind = [];
      if (numDifference === 1) {
        //need to find larger number and smaller number
        let largerNumber = Math.max(first.get(0), second.get(0)) + 1;
        if (largerNumber <= NUM_TROOP_VALUES) {
          cardsToFind.push(List([largerNumber, first.get(1)]));
        }
        let smallerNumber = Math.min(first.get(0), second.get(0)) - 1;
        if (smallerNumber > 0) {
          cardsToFind.push(List([smallerNumber, first.get(1)]));
        }
      } else {
        //need to find middle number
        cardsToFind.push(List([Math.min(first.get(0), second.get(0)) + 1, first.get(1)]));
      }
      let unplayedCards = List(cardsToFind).filterNot((card) => {
        return cardsPlayed.some((playedCard) => card.equals(playedCard));
      });

      if (!unplayedCards.isEmpty()) {
        const line = List.of(first, second, unplayedCards.first());
        return scoreLine(line);
      }

    }

  }
}


function baseScore(lane) {
  return lane.reduce((sum, card) => {
    return sum + card.first();
  }, 0);
}

function isSkirmish(lane) {
  let sortedScores = (lane.map((card) => {
    return card.first();
  })).sort();

  return sortedScores.get(1) === sortedScores.first() + 1 && sortedScores.get(2) === sortedScores.first() + 2;
}

function isBattalion(line) {
  let suite = line.first().get(1);
  return line.getIn([1, 1]) === suite && line.getIn([2, 1]) === suite;
}

function isPhalanx(line) {
  let troopNumber = line.first().get(0);
  return line.getIn([1, 0]) === troopNumber && line.getIn([2, 0]) === troopNumber;
}

function isWedge(line) {
  return isSkirmish(line) && isBattalion(line);
}

export function scoreLine(line) {
  let score = baseScore(line);

  if (isWedge(line)) {
    score += WEDGE_BONUS;
  } else if (isPhalanx(line)) {
    score += PHALANX_BONUS;
  } else if (isBattalion(line)) {
    score += BATTALION_BONUS;
  } else if (isSkirmish(line)) {
    score += SKIRMISH_BONUS;
  }
  return score;
}
