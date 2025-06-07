import { SignIn } from "@clerk/nextjs";

export default function Login() {
    return (
        <div className="bg-subflow-900 flex h-[calc(100vh-7.25rem)] flex-col items-center justify-center gap-y-8">
            <span className="font-poetsen text-subflow-50 text-3xl font-bold tracking-wider">
                Welcome Back
            </span>
            {/* <span className="text-subflow-50 text-lg font-poetsen tracking-wider">Sign in to continue your subflow</span> */}
            <div className="bg-subflow-50/50 border-subflow-50/70 rounded-2xl border-[1.5px] p-1">
                <SignIn />
            </div>
            <span className="text-subflow-50 font-poetsen text-sm tracking-widest">
                Secure authentication powered by Clerk
            </span>
        </div>
    );
}
