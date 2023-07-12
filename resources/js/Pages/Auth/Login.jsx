import React, { useEffect } from 'react';
import Checkbox from '@/Components/Auth/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/Auth/InputError';
import InputLabel from '@/Components/Auth/InputLabel';
import TextInput from '@/Components/Auth/TextInput';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, errors, reset } = useForm({
    email: 'kakoogemanager@julaw.com',
    password: '123456789',
    remember: '',
  });

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
  };

  const submit = (e) => {
    e.preventDefault();

    post(route('login'));
  };

  return (
    <GuestLayout>
      <Head title="Log in" />

      {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

      <div className="d-flex justify-content-end align-items-baseline mt-2">
        <p className="me-3" style={{fontSize: "25px"}}>Login or </p><Link href={route('register')}>
        <button type="submit" className="btn btn-dark">Register</button>
        </Link>
      </div>

      <form onSubmit={submit}>
        <div className="mb-3">
          <InputLabel forInput="email" value="Email" />

          <TextInput
            type="text"
            name="email"
            value={data.email}
            autoComplete="username"
            isFocused={true}
            handleChange={onHandleChange}
          />

          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="mb-3">
          <InputLabel forInput="password" value="Password" />

          <TextInput
            type="password"
            name="password"
            value={data.password}
            autoComplete="current-password"
            handleChange={onHandleChange}
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mb-3">
          <div className="form-check">
              <Checkbox name="remember" value={data.remember} handleChange={onHandleChange} />
              <label className="form-check-label">Remember Me</label>
          </div>
        </div>

        <div className="mb-0">
          <div className="d-flex justify-content-end align-items-baseline">
            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="text-muted me-3"
              >
                Forgot your password?
              </Link>
            )}

            <button type="submit" className="btn btn-dark">Log in</button>
          </div>
        </div>
      </form>
    </GuestLayout>
  );
}
