import { PrimaryButton, InputField } from "../../components";

export default function ResetPassword() {

    
    return ( 
        <section className="w-full md:w-2/4 m-auto">
            <h1 className="mb-10 text-orange-500 text-xl text-center font-bold">Reset Password</h1>
            <h2 className="mb-10 text-lg">Enter email address associated to your Registered Account, to send a Update Password link.</h2>
            <form className="mt-10">
                <InputField type="email" label="Registered Email" placeholder="Enter email"/>
                <PrimaryButton extraCSS="mt-4 float-right" type="submit">Send reser password link</PrimaryButton>
            </form>
        </section>
     );
}