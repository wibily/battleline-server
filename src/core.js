import {Map, is, fromJS} from 'immutable';
import {shuffle} from 'lodash/collection';
import {ERRORS} from './errors';

export const EMPTY_LANE = {
  winner: null,
  p1: [],
  p2: []
};

const NUM_SUITES = 6;
const NUM_TROOP_VALUES = 10;

function shuffleDeck() {
  let deck = [];
  for (let suite = 1; suite <= NUM_SUITES; suite++) {
    for (let troop = 1; troop <= NUM_TROOP_VALUES; troop++) {
      deck.push([troop, suite]);
    }
  }
  return shuffle(deck);
}

export function start() {
  let deck = fromJS(shuffleDeck());

  return Map({
    error: null,
    winner: null,
    turn: 'p1',
    p1: deck.slice(0, 7),
    p2: deck.slice(7, 14),
    deck: deck.skip(14),
    lanes: fromJS(new Array(9).fill(EMPTY_LANE))
  });
}

function isCardInHand(state, action) {
  let player = state.get('turn');
  let playedCard = fromJS(action.card);

  return state.get(player).find(cardInHand => is(cardInHand, playedCard));
}

function isLaneWon(state, action) {
  return state.getIn(['lanes', action.lane, 'winner']);
}

function isLaneFull(state, action) {
  let player = state.get('turn');

  return state.getIn(['lanes', action.lane, player]).size >= 3;
}

function isGameOver(state) {
  return !!state.get('winner');
}

function getErrors(state, action) {

  if (isGameOver(state)) {
    return ERRORS.play.gameIsAlreadyOver;
  }

  if (!isCardInHand(state, action)) {
    return ERRORS.play.cardNotInHand;
  }

  if (isLaneWon(state, action)) {
    return ERRORS.play.laneIsAlreadyWon;
  }

  if (isLaneFull(state, action)) {
    return ERRORS.play.laneIsAlreadyFull;
  }

  return null;
}

function switchTurn(turn) {
  return (turn === 'p1') ? 'p2' : 'p1';
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

function scoreLine(line) {
  const SKIRMISH_BONUS = 30;
  const BATTALION_BONUS = 2 * SKIRMISH_BONUS;
  const PHALANX_BONUS = 3 * SKIRMISH_BONUS;
  const WEDGE_BONUS = 4 * SKIRMISH_BONUS;

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

function scoreCompleteLane(lane) {
  let p1Score = scoreLine(lane.get('p1'));
  let p2Score = scoreLine(lane.get('p2'));

  if (p1Score > p2Score) {
    return lane.set('winner', 'p1');
  } else {
    return lane.set('winner', 'p2');
  }
}

function updateWinners(lanes) {
  return lanes.map((lane) => {
    if (lane.winner) {
      return lane;
    }

    const p1LaneSize = lane.get('p1').size;
    const p2LaneSize = lane.get('p2').size;

    if (p1LaneSize === 3 && p2LaneSize === 3) {
      return scoreCompleteLane(lane);
    }

    return lane;
  });
}

export function play(state, action) {
  let player = state.get('turn');
  let playedCard = fromJS(action.card);

  let errors = getErrors(state, action);

  if (errors) {
    return state.set('error', errors);
  }

  return state
    .set('error', null)
    .set('turn', switchTurn(player))
    .set(player, state.get(player).filterNot(card => is(card, playedCard)).push(state.get('deck').first()))
    .set('deck', state.get('deck').shift())
    .updateIn(['lanes', action.lane, player], lane => lane.push(fromJS(action.card)))
    .update('lanes', lanes => updateWinners(lanes));
}
