import {Map, List} from 'immutable';
import {expect} from 'chai';

import {start} from '../src/core';

describe('application logic', () => {

  describe('start', () => {

    it('should return expected non random fields', () => {
      const nextState = start();

      const expectedFields = Map({
        error: null,
        winner: null,
        turn: 'p1',
        lanes: List.of(
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          })
        )
      });

      for (let key of expectedFields.keys()) {
        expect(nextState.get(key)).equals(expectedFields.get(key));
      }
    });

    it('should return shuffled fields', () => {
      const nextState = start();
      expect(nextState.get('p1').size).equals(7);
      expect(nextState.get('p2').size).equals(7);
      expect(nextState.get('deck').size).equals(46);
    });

  });
});
