import React, {useEffect} from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/Auth/InputError';
import InputLabel from '@/Components/Auth/InputLabel';
import TextInput from '@/Components/Auth/TextInput';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

export default function RegisterBranch(props) {
  const { data, setData, post, errors, reset } = useForm({
    name: '',
    location: '',
    password: '',
    password_confirmation: ''
  });

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
  };

  const onHandleNameChange = (event) => {
    setData(event.target.name, (event.target.value.replace(/\s/g,'')).toLowerCase());
  };

  const submit = (e) => {
    e.preventDefault();

    post(route('branch.store'));
  };

  return (
    <GuestLayout>
      <Head title="Register Branch" />

      <form onSubmit={submit}>
        <div className="mb-3">
          <h3>Register branch (Please dont forget name and key)</h3>
        </div>
        <div className="mb-3">
          <InputLabel forInput="name" value="Name" />

          <TextInput
            type="text"
            name="name"
            value={data.name}
            autoComplete="name"
            isFocused={true}
            handleChange={onHandleNameChange}
            required
          />

          <InputError message={errors.name} className="mt-2" />
        </div>

        <div className="mb-3">
          <InputLabel forInput="email" value="Manager Email" />

          <input type="text" className="form-control" disabled={true} value={data.name+'manager@julaw.com'} />
        </div>

        <div className="mb-3">
          <InputLabel forInput="location" value="Location" />

          <TextInput
            type="text"
            name="location"
            value={data.location}
            autoComplete="location"
            handleChange={onHandleChange}
            required
          />

          <InputError message={errors.location} className="mt-2" />
        </div>

        <div className="mb-3">
          <InputLabel forInput="password" value="Manager Password" />

          <TextInput
            type="password"
            name="password"
            value={data.password}
            autoComplete="new-password"
            handleChange={onHandleChange}
            required
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mb-3">
          <InputLabel forInput="password_confirmation" value="Confirm Password" />

          <TextInput
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            handleChange={onHandleChange}
            required
          />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="mb-0">
          <div className="d-flex justify-content-end align-items-baseline">
            <button type="submit" className="btn btn-dark">Register Branch</button>
          </div>
        </div>

        <div className="d-flex items-center justify-content-end mt-4 bold">
          For users of registered branch only
        </div>

        <div className="d-flex items-center justify-content-end mt-4">
          {props.auth.user ? (
            <Link href={route('dashboard')}>
              <button type="button" className="btn btn-dark ml-4">Dashboard</button>
            </Link>
          ) : (
            <>
              <Link href={route('login')}>
                <button type="button" className="btn btn-dark ml-4">Log in</button>
              </Link>

              <Link href={route('register')}>
                <button type="button" className="btn btn-dark ml-4">Register</button>
              </Link>
            </>
          )}
        </div>
      </form>
    </GuestLayout>
  );
}
