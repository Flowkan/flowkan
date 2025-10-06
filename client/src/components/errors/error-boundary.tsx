import { Component, type ErrorInfo, type ReactNode } from "react";
import { t } from "i18next";

interface ErrorBoundaryProps {
	children: ReactNode;
}

class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	{
		error: null | Error;
		info: unknown;
	}
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			error: null,
			info: null,
		};
	}
	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error("Error caught by ErrorBoundary:", error, errorInfo);
		this.setState({
			error,
			info: errorInfo,
		});
	}
	render() {
		const { error, info } = this.state;
		if (!error) {
			return this.props.children;
		}

		return (
			<div className="rounded-md border border-red-200 bg-red-50 p-6 shadow-sm">
				<h1 className="mb-4 text-2xl font-semibold text-red-700">
					{t("errorBoundary", "Oooops!!!!")}
				</h1>
				<div className="mb-2">
					<code className="block rounded bg-red-100 p-2 text-sm text-red-800">
						{error.message}
					</code>
				</div>
				<div>
					<code className="block rounded bg-red-100 p-2 text-sm whitespace-pre-wrap text-red-800">
						{JSON.stringify(info)}
					</code>
				</div>
			</div>
		);
	}
}

export default ErrorBoundary;
