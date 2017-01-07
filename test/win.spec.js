import {List, Map, fromJS} from 'immutable';

import {expect} from 'chai';

import {play, EMPTY_LANE} from '../src/core';
import {ERRORS} from '../src/errors';

describe('win detection logic', () => {

  it('should not allow players to play cards after the game has been won', ()=> {
    let p1WonState = Map({
      error: null,
      winner: 'p1',
      turn: 'p2',
      p1: List(),
      p2: fromJS([[1, 1]]),
      deck: fromJS([[2,1], [3,2]]),
      lanes: fromJS([
        EMPTY_LANE, EMPTY_LANE, EMPTY_LANE,
        {winner: 'p1'}, {winner: 'p1'}, {winner: 'p1'},
        EMPTY_LANE, EMPTY_LANE, EMPTY_LANE
      ])
    });

    let nextState = play(p1WonState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });

    expect(nextState).equal(p1WonState.set('error', ERRORS.play.gameIsAlreadyOver));
  });

  it('should allow players to win a lane by host', ()=> {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[5,2]]),
      p2: fromJS([[1, 1]]),
      deck: fromJS([[2,1], [3,2]]),
      lanes: fromJS([{
        winner: null,
        p1: [[1,4], [2,2]],
        p2: [[1,5], [2,6], [4,2]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [5, 2],
      lane: 0
    });

    let expectedState = Map({
      error: null,
      winner: null,
      turn: 'p2',
      p1: fromJS([[2,1]]),
      p2: fromJS([[1, 1]]),
      deck: fromJS([[3,2]]),
      lanes: fromJS([{
        winner: 'p1',
        p1: [[1,4], [2,2], [5,2]],
        p2: [[1,5], [2,6], [4,2]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    expect(nextState).equal(expectedState);

  });


});