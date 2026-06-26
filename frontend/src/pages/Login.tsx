import { PawPrint, LockIcon } from "lucide-react";

export default function Login() {
    return (
        <main className="font-[Inter] bg-stone-50 min-h-screen">
            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
                <a href="/" className="mb-10">
                    <div>
                        <PawPrint className="h-5 w-5 text-emerald-600">
                        </PawPrint>
                        <span className="text-base font-semibold text-slate-900">
                            Pingo Notes
                        </span>
                    </div>
                </a>
                <div className="w-full max-w-md">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <LockIcon className="h-5 w-5 text-emerald-600 mb-3" />
                        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
                            {{
                                signin: "Pingo sign in",
                                signup: "Join the Pingo Pack",
                                recover: "Fetch your password",
                            }["signin"] ?? "Pingo sign in"}
                        </h1>
                        <p></p>
                        <div></div>
                    </div>
                </div>
            </div>
        </main>
    )
}