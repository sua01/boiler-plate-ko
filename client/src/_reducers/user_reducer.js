import {
  LOGIN_USER
} from '../_actions/types';


export default function (state = {}, action) {  // 현재 state은 비어있는 상태
  switch (action.type) {  // type마다의 조치 취하기
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload}
      break;
  
    default:
      return state;
  }
}