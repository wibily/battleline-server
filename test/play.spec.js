import {List, Map, fromJS} from 'immutable';

import {expect} from 'chai';

import {play, EMPTY_LANE} from '../src/core';

import {ERRORS} from '../src/errors';

describe('play logic', () => {

  it('should allow players to play a card from their hand into a lane', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[1, 1]]),
      p2: List(),
      deck: fromJS([[2, 1], [3, 2]]),
      lanes: fromJS(new Array(9).fill(EMPTY_LANE))
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });


    expect(nextState.get('turn')).equals('p2');
    expect(nextState.get('p1')).equals(fromJS([[2, 1]]));
    expect(nextState.get('lanes').equals(
      fromJS([
        {
          winner: null,
          p1: [[1, 1]],
          p2: []
        }, ...new Array(8).fill(EMPTY_LANE)]
      )));

    expect(nextState.get('deck').equals(fromJS([[3, 2]])));
  });

  it('should clear existing errors upon a valid move', () => {
    let startState = Map({
      error: ERRORS.play.cardNotInHand,
      winner: null,
      turn: 'p1',
      p1: fromJS([[1, 1]]),
      p2: List(),
      deck: fromJS([[2, 1], [3, 2]]),
      lanes: fromJS(new Array(9).fill(EMPTY_LANE))
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });

    expect(nextState.get('error')).equals(null);

  });

  it('should draw a card after they have played a card from their hand', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[1, 1]]),
      p2: List(),
      deck: fromJS([[2, 1]]),
      lanes: fromJS(new Array(9).fill(EMPTY_LANE))
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });

    expect(nextState.get('p1')).equals(fromJS([[2, 1]]));


  });

  it('should not allow players to play cards they do not have in their hand', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[1, 1]]),
      p2: List(),
      deck: fromJS([[2, 1]]),
      lanes: fromJS(new Array(9).fill(EMPTY_LANE))
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [10, 3],
      lane: 0
    });

    expect(nextState).equal(startState.set('error', ERRORS.play.cardNotInHand));
  });

  it('should not allow players to play cards into lanes that are already won', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[1, 1]]),
      p2: List(),
      deck: fromJS([[2, 1]]),
      lanes: fromJS([{
        winner: 'p1',
        p1: [[8, 1], [9, 1], [10, 1]],
        p2: List()
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });

    expect(nextState).equal(startState.set('error', ERRORS.play.laneIsAlreadyWon));
  });

  it('should not allow players to play cards into lanes that are already full', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[1, 1]]),
      p2: List(),
      deck: fromJS([[2, 1]]),
      lanes: fromJS([{
        winner: null,
        p1: [[1, 4], [2, 2], [3, 3]],
        p2: List()
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });

    expect(nextState).equal(startState.set('error', ERRORS.play.laneIsAlreadyFull));
  })

});
