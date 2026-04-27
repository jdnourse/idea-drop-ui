import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export const Route = createFileRoute("/(auth)/login/")({
    component: LoginPage,
});

function LoginPage() {
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { mutateAsync, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            setUser(data.user);
            navigate({ to: "/ideas" });
        },
        onError: (err: any) => {
            setError(err.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            mutateAsync({ email, password });
        } catch (err: any) {
            console.log(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            {error && (
                <div
                    className="border border-white text-blue-500 px-4 py-3 mb-4 rounded relative"
                    role="alert"
                >
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    className="w-full border border-white rounded-md p-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                />
                <input
                    type="password"
                    className="w-full border border-white rounded-md p-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="block w-full border border-white bg-transparent text-green-200 hover:text-green-500 font-semibold px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="text-sm text-center mt-4">
                Don't have an account?{"   "}
                <Link
                    to="/register"
                    className="text-green-200 font-semibold hover:text-green-500"
                >
                    Register
                </Link>
            </p>
        </div>
    );
}
