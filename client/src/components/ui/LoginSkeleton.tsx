function LoginSkeleton() {
	return (
		<div className="bg-background flex min-h-screen items-center justify-center">
			<div className="w-full max-w-sm animate-pulse space-y-6 rounded bg-white p-8 shadow-md">
				<div className="mx-auto h-6 w-32 rounded bg-gray-300" />

				<div className="h-10 w-full rounded border bg-red-100" />

				<div className="space-y-2">
					<div className="h-4 w-32 rounded bg-gray-300" />
					<div className="h-10 w-full rounded bg-gray-300" />
				</div>

				<div className="space-y-2">
					<div className="h-4 w-24 rounded bg-gray-300" />
					<div className="h-10 w-full rounded bg-gray-300" />
				</div>

				<div className="flex items-center space-x-2">
					<div className="h-4 w-4 rounded bg-gray-300" />
					<div className="h-4 w-24 rounded bg-gray-300" />
				</div>

				<div className="h-10 w-full rounded bg-gray-300" />
			</div>
		</div>
	);
}

export default LoginSkeleton;
