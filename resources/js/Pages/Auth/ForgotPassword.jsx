import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/Auth/InputError';
import TextInput from '@/Components/Auth/TextInput';
import { Head, useForm } from '@inertiajs/inertia-react';
import InputLabel from "@/Components/Auth/InputLabel";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4">
                Forgot your password? No problem. Just let us know your email address and we will email you a password
                reset link that will allow you to choose a new one.
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
              <div className="mb-3">
                <InputLabel forInput="email" value="Email" />
                <TextInput
                    type="text"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    handleChange={onHandleChange}
                />
              </div>

                <InputError message={errors.email} className="mt-2" />

                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-dark">Email Password Reset Link</button>
                </div>
            </form>
        </GuestLayout>
    );
}
