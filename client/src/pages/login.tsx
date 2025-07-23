import { Page } from "../components/layout/page";

export const LoginPage = () => {
	const handleChange = () => {};
	const handleSubmit = () => {};

	return (
		<Page title="Login">
			<form
				action="/login"
				onSubmit={handleSubmit}
				method="POST"
				className="space-y-2"
			>
				<div>
					<label htmlFor="email">Email: </label>
					<input 
            id="email" 
            type="text" 
            name="email" 
            placeholder="email"
            required
          />
				</div>
				<div>
					<label htmlFor="password">Password: </label>
					<input
						id="password"
						type="password"
						name="password"
						placeholder="password"
            required
					/>
				</div>
			</form>
			<button type="submit" onClick={handleChange} className="cursor-pointer pt-6">
				Entrar
			</button>
		</Page>
	);
};
