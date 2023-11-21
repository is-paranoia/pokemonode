import { useForm } from "react-hook-form"
import './RegisterPage.css'
// import { useEffect, useState } from "react"
// import { useHistory } from 'react-router-dom';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  // const history = useHistory();
  // const [isRegistered, setIsRegistered] = useState(false);

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
        //setIsRegistered(true)
      }
        console.log('register result', result);
    })
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
    </div>
  )
}

export default RegisterPage