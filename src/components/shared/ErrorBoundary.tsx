import { Component, type ErrorInfo, type ReactNode } from 'react'
import { i18n } from '@/i18n'

type Props = {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    if (this.props.fallback) return this.props.fallback(error, this.reset)

    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-danger-200 bg-danger-50 p-8 text-center dark:border-danger-500/30 dark:bg-danger-500/10">
          <h2 className="text-lg font-semibold text-danger-700 dark:text-danger-300">
            {i18n.t('errors.boundaryTitle')}
          </h2>
          <p className="mt-2 text-sm text-danger-700 dark:text-danger-200">{error.message}</p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-5 cursor-pointer rounded-lg bg-danger-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-700"
          >
            {i18n.t('errors.tryAgain')}
          </button>
        </div>
      </div>
    )
  }
}
