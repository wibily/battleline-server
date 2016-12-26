import {List, Map, fromJS} from 'immutable';

import {expect} from 'chai';

import {play, EMPTY_LANE} from '../src/core';

describe('play logic', () => {
  it('should allow players to play a card from their hand into their lane', ()=> {
    let startState = Map({
      winner: null,
      turn: 'p1',
      p1: fromJS([[1, 1]]),
      p2: List(),
      deck: List(),
      lanes: fromJS(Array(9).fill(EMPTY_LANE))
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });


    expect(nextState.get('turn')).equals('p2');
    expect(nextState.get('p1')).equals(fromJS([]));
    expect(nextState.get('lanes').equals(
      fromJS([
        {
          winner: null,
          p1: [[1, 1]],
          p2: []
        }, ...Array(8).fill(EMPTY_LANE)]
    )));
  });
});