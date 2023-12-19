import { useForm } from "react-hook-form"
import { observer } from 'mobx-react-lite';
import authStore from '@stores/AuthStore';
import './LoginPage.css'
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate();


  const onSubmit = (data) => {
    fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((result) => {
      console.log('login result', result);
      result?.token && authStore.login(result);
      result?.token && navigate('/');
      console.log('login result2', result);
    })
  }

  return (
    <div className={'login'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Введите имя..." {...register("name", { required: true })} />
        <input placeholder="Введите пароль..." {...register("password", { required: true })} />
        <input placeholder="Введите 2FA-код..." {...register("code", { required: true })} />
        {errors.exampleRequired && <span>This field is required</span>}
        <input type="submit" />
      </form>
    </div>
  )
}

export default observer(LoginPage)