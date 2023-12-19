import { useForm } from "react-hook-form"
import './RegisterPage.css'
import {QRCodeSVG} from 'qrcode.react';
import { useEffect, useState } from "react"
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // const {
  //   register: submit2fa,
  //   handleSubmit: handle2faSubmit,
  //   formState: { errors2fa },
  // } = useForm()
  const navigate = useNavigate();
  const [QR2FA, setQR2FA] = useState(undefined);
  const [emailGlob, setEmailGlob] = useState(undefined)

  useEffect(() => {
    console.log('new qr-code');
  }, [QR2FA])

  // useEffect(() => {
  //   if (isRegistered) {
  //     history.push('/login');
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isRegistered]);

  const onSubmit = (data) => {
    fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((result) => {
      if (result.registered) {
        setEmailGlob(data.email);
        const url2fa = `otpauth://totp/pokebun:${data.email}?secret=${result.secret2fa}&issuer=pokebun`
        setQR2FA(url2fa)
      }
        console.log('register result', result);
    })
  }

  const on2FA = (data) => {
    const verify2fa = {...data}
    console.log('on2FA', verify2fa);
    fetch('http://localhost:8080/submit2fa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(verify2fa)
    })
    .then((response) => response.json())
    .then((result) => {
      if (result.confirmed) {
        alert('confirmed!!!')
        navigate('/login');
      }
    })
  }

  if (QR2FA) {
    return (
      <div className={'register'}>
        <h1>Добавьте двухфакторную аутентификацию!</h1>
        <QRCodeSVG width={'256px'} height={'256px'} value={QR2FA} />
        <h2>Введите код из Google Authenticator:</h2>
        <form onSubmit={handleSubmit(on2FA)}>
          <input placeholder="Введите код..." {...register("code", { required: true })} />
          {errors.exampleRequired && <span>This field is required</span>}
          <input type="submit" />
        </form>
      </div>
    )
  }

  return (
    <div className={'register'}>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Введите имя..." {...register("name", { required: true })} />
        <input placeholder="Введите почту..." {...register("email", { required: true })} />
        <input placeholder="Введите пароль..." {...register("password", { required: true })} />
        {errors.exampleRequired && <span>This field is required</span>}
        <input type="submit" />
      </form>
      {/* {QR2FA ? <QRCodeSVG width={'256px'} height={'256px'} value={QR2FA} /> : null} */}
    </div>
  )
}

export default observer(RegisterPage)