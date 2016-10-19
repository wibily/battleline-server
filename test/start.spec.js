import {Map, List, fromJS} from 'immutable';
import {expect} from 'chai';

import {start} from '../src/core';

describe('application logic', () => {

  describe('start', ()=> {

    it('should return expected non random fields', () => {
      const nextState = start();

      const expectedFields = Map({
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

      expect(nextState.get('winner')).equals(expectedFields.get('winner'));
      expect(nextState.get('turn')).equals(expectedFields.get('turn'));

      let expectedFieldsItr = expectedFields.entries();
      for(let i = expectedFieldsItr.next(); !i.done; i = expectedFieldsItr.next()){
        expect(nextState.get(i.value[0])).equals(i.value[1]);
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