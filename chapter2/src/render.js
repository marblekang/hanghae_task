const validateChildren = (newNode, el) => {
  if (typeof el === "string") {
    newNode.innerHTML = el;
  } else {
    newNode.appendChild(el);
  }
};

export function jsx(type, props, ...children) {
  const newNode = createElement(type);

  if (Array.isArray(children)) {
    children.forEach((el) => {
      validateChildren(newNode, el);
    });
  } else {
    validateChildren(newNode, children);
  }

  for (const key in props) {
    newNode.setAttribute(key, props[key]);
  }
  return newNode;
}

export function createElement(node) {
  const template = document.createElement(node);
  return template;
}

// diff 알고리즘
// target - oldProps
// newProps - newNode
// oldProps - oldNode
// 이 둘 사이에 다른 부분만 target에 반영.
function updateAttributes(target, newProps, oldProps) {
  console.log(target);
  for (let key in newProps) {
    console.log(key, newProps[key]);
    // if (key in oldProps && newProps[key] === oldProps[key]) {
    //   console.log(1);
    //   return;
    // } else {
    //   console.log(2);
    //   target[key] = newProps[key];
    // }
  }

  for (let key in oldProps) {
    if (key in newProps) {
      console.log(3);
      return;
    } else {
      console.log(4);
      target.removeAttribute(key);
    }
  }

  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if (!newNode && oldNode) {
    console.log(1);
    parent.removeChild(oldNode);
    return;
  }
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if (newNode && !oldNode) {
    console.log(2);
    parent.appendChild(newNode);
    return;
  }
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (
    typeof newNode === "string" &&
    typeof oldNode === "string" &&
    newNode !== oldNode
  ) {
    console.log(3);
    parent.replceChild(newNode, oldNode);
    return;
  }
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (typeof newNode !== typeof oldNode) {
    console.log(4);
    parent.replceChild(newNode, oldNode);
    return;
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(oldNode, newNode.cloneNode(true), oldNode.cloneNode(true));
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출

  parent.appendChild(newNode);
}

const App = jsx(
  "div",
  { id: "test-id", class: "test-class" },
  jsx("p", null, "첫 번째 문단"),
  jsx("p", null, "두 번째 문단")
);
const $root = document.createElement("div");
render(
  $root,
  jsx(
    "div",
    { id: "test-id", class: "test-class" },
    jsx("p", null, "첫 번째 문단"),
    jsx("p", null, "두 번째 문단"),
    jsx("p", null, "세 번째 문단")
  ),
  App
);
