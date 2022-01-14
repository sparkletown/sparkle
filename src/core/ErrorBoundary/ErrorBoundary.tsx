import React, { ErrorInfo } from "react";

export class ErrorBoundary<T> extends React.Component<T> {
  state: { hasError: boolean };

  constructor(props: T) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError<T>(error: Readonly<T>) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(ErrorBoundary.name, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
