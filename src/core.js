import {Map, is, fromJS} from 'immutable';
import {shuffle} from 'lodash/collection';
import {ERRORS} from './errors';
import {scoreLine} from './score';

export const EMPTY_LANE = {
  winner: null,
  p1: [],
  p2: []
};

export const NUM_SUITES = 6;
export const NUM_TROOP_VALUES = 10;

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

function getCompletedLaneWinner(p1Score, p2Score, lastPlayed) {
  if (p1Score > p2Score) {
    return 'p1';
  } else if (p1Score < p2Score) {
    return 'p2'
  } else { //the person that plays the last card loses in a tie
    return switchTurn(lastPlayed);
  }
}

function updateWinners(lanes, lastPlayed) {
  return lanes.map((lane) => {
    if (lane.winner) {
      return lane;
    }

    const p1LaneSize = lane.get('p1').size;
    const p2LaneSize = lane.get('p2').size;

    if (p1LaneSize === 3 || p2LaneSize === 3) {
      let p1Score = scoreLine(lane.get('p1'));
      let p2Score = scoreLine(lane.get('p2'));

      if (p1LaneSize === 3 || p2LaneSize === 3) {
        if (p1LaneSize === 3 && p2LaneSize === 3) {
          return lane.set('winner', getCompletedLaneWinner(p1Score, p2Score, lastPlayed));
        }
        //todo put deduced win logic here
      }
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
    .update('lanes', lanes => updateWinners(lanes, player));
}
