const deepEqual = (a, b) => {
  const result = a.every((val, idx) => val === b[idx]);
  return result;
};

export function createHooks(callback) {
  let _stateList = [];

  let _index = 0;
  let _memoList = [];
  let _prevRefs = [];

  const useState = (initState) => {
    let currentIndex = _index;
    _stateList[currentIndex] = _stateList[currentIndex] || initState;
    let state = _stateList[currentIndex];
    const setState = (newValue) => {
      if (_stateList[currentIndex] === newValue) {
        return;
      }

      _stateList[currentIndex] = newValue;

      callback();
    };
    console.log(initState, _stateList, "initialStateSetting");
    _index++;
    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    let currentIndex = _index;
    _prevRefs = _prevRefs || refs;
    /* [0] [0] 비교가 아니라 배열 돌면서 값 비교해야함.
      primitive / reference 비교 해야함.
    */
    if (!_memoList[currentIndex] || !deepEqual(_prevRefs, refs)) {
      _memoList[currentIndex] = fn();
      _prevRefs = refs;
    }
    return _memoList[currentIndex];
  };

  const resetContext = () => {
    // 1) setState를 할때 컴포넌트 자체가 다시 호출됨
    // 2) 컴포넌트가 다시 호출되면 useState도 다시 호출됨.
    // 3) 그때 값이 초기화 되면 안됨.
    _index = 0;
  };

  return { useState, useMemo, resetContext };
}

/* 
- useState 처음 선언할때 배열에 값 담김
- setState하면 useState 다시 실행됨 (render => 컴포넌트 재호출 => useState 재호출)
- useState시점 => 이때 해당 index에 값이 있으면 값 안바꿈.
- setState 시점 => setState에 전달된 값은 무조건 업데이트.
- index는 선언된 useState 갯수만큼 증가됨.
- 따라서 index를 reset 하더라도 useState의 갯수에 따라 다시 지정됨.
*/
