import React, { ErrorInfo } from "react";

export type ErrorBoundaryFallbackProps = {
  error?: Error;
  errorInfo?: ErrorInfo;
};

export type ErrorBoundaryProps = {
  name?: string;
  fallback?: React.FC<ErrorBoundaryFallbackProps>;
  consoleLog?: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state: {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError<T>(error: Readonly<T>) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      ...this.state,
      error,
      errorInfo,
    });

    if (this.props.consoleLog) {
      console.error(
        this.props.name || ErrorBoundary.name || "ErrorBoundary",
        error,
        errorInfo
      );
    }
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const children = this.props.children;

    const Fallback = this.props.fallback;
    const fallback = Fallback ? (
      <Fallback {...this.props} error={error} errorInfo={errorInfo} />
    ) : (
      <></>
    );

    return <>{hasError ? fallback : children}</>;
  }
}
