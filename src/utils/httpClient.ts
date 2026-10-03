export interface RequestPolicy {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  signal?: AbortSignal;
}

export class ExternalServiceError extends Error {
  constructor(
    message: string,
    public readonly service: string,
    public readonly kind: 'TIMEOUT' | 'HTTP' | 'NETWORK' | 'RATE_LIMIT' | 'INVALID_RESPONSE'
  ) {
    super(message);
    this.name = 'ExternalServiceError';
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function requestJson<T>(
  service: string,
  url: string,
  init: RequestInit = {},
  policy: RequestPolicy = {}
): Promise<T> {
  const timeoutMs = policy.timeoutMs ?? 15000;
  const retries = policy.retries ?? 1;
  const retryDelayMs = policy.retryDelayMs ?? 500;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const signal = init.signal
      ? AbortSignal.any([init.signal, controller.signal])
      : controller.signal;

    try {
      const response = await fetch(url, { ...init, signal });
      if (response.status === 429) {
        throw new ExternalServiceError(`${service} rate limit`, service, 'RATE_LIMIT');
      }
      if (!response.ok) {
        throw new ExternalServiceError(`${service} returned HTTP ${response.status}`, service, 'HTTP');
      }
      try {
        return await response.json() as T;
      } catch {
        throw new ExternalServiceError(`${service} returned invalid JSON`, service, 'INVALID_RESPONSE');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        if (init.signal?.aborted) throw error;
        if (attempt < retries) {
          await sleep(retryDelayMs * (attempt + 1));
          continue;
        }
        throw new ExternalServiceError(`${service} timed out`, service, 'TIMEOUT');
      }
      if (error instanceof ExternalServiceError && attempt < retries && (error.kind === 'RATE_LIMIT' || error.kind === 'HTTP')) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }
      if (error instanceof ExternalServiceError) throw error;
      if (attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }
      throw new ExternalServiceError(`${service} network request failed`, service, 'NETWORK');
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new ExternalServiceError(`${service} request failed`, service, 'NETWORK');
}
