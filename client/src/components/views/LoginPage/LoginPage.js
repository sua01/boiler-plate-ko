// import { Axios } from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

import { useNavigate } from 'react-router-dom';


function LoginPage() {

  const dispatch = useDispatch();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const navigate = useNavigate();

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); // 페이지가 리프레시되는 걸 막아줌


    let body = {
      email: Email,
      password: Password
    }

    
    dispatch(loginUser(body))
      .then(response => {
        if(response.payload.loginSuccess) { // 로그인페이지에서 LandingPage로 이동
          navigate('/')
        } else{
          alert('Error')
        }
      })
    
  }


  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100vh'
  }}>
      
      <form style={{display:'flex', flexDirection:'column'}}
          onSubmit={onSubmitHandler}
          >

        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        
        <br/>
        <button type='submit'>
          Login
        </button>

      </form>



    </div>
  )
}

export default LoginPage