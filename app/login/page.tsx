import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
	return (
		<div className="grid min-h-screen lg:grid-cols-2">
			{/* Left panel */}
			<div className="relative hidden flex-col bg-zinc-900 p-10 text-white lg:flex">
				<div className="flex items-center gap-2 text-lg font-semibold">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-6 w-6"
					>
						<title>Logo</title>
						<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
					</svg>
					Beer Dashboard
				</div>
				<div className="mt-auto">
					<blockquote className="space-y-2">
					</blockquote>
				</div>
			</div>

			{/* Right panel */}
			<div className="flex items-center justify-center p-8">
				<div className="w-full max-w-sm space-y-6">
					<div className="space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Welcome back
						</h1>
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							Enter your credentials to sign in
						</p>
					</div>

					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								autoComplete="email"
								required
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<Link
									href="/forgot-password"
									className="text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								autoComplete="current-password"
								required
							/>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="remember" />
							<Label htmlFor="remember" className="cursor-pointer font-normal">
								Remember me
							</Label>
						</div>
						<Button type="submit" className="w-full">
							Sign in
						</Button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
								Or continue with
							</span>
						</div>
					</div>

					<Button variant="outline" className="w-full gap-2">
						<svg role="img" viewBox="0 0 24 24" className="h-4 w-4">
							<title>GitHub</title>
							<path
								fill="currentColor"
								d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
							/>
						</svg>
						GitHub
					</Button>

					<p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
