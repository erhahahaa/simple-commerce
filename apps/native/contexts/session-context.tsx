import type { GetSessionResponse } from "@simple-commerce/schema/auth";
import type { User } from "@simple-commerce/schema/user";
import type { ErrorResponse } from "@simple-commerce/schema/utils";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { authClient } from "@/lib/auth-client";

type SessionData = GetSessionResponse | ErrorResponse | null;

type SessionContextType = {
	session: SessionData;
	isLoading: boolean;
	isAuthenticated: boolean;
	user: User | null;
	refetch: () => Promise<void>;
	clearSession: () => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Event emitter for session updates (used by auth hooks)
type SessionEventType = "refetch" | "clear";
type SessionEventListener = () => void;

const sessionEventListeners: Map<
	SessionEventType,
	Set<SessionEventListener>
> = new Map();

export function emitSessionEvent(event: SessionEventType) {
	const listeners = sessionEventListeners.get(event);
	if (listeners) {
		for (const listener of listeners) {
			listener();
		}
	}
}

function subscribeToSessionEvent(
	event: SessionEventType,
	listener: SessionEventListener,
) {
	if (!sessionEventListeners.has(event)) {
		sessionEventListeners.set(event, new Set());
	}
	sessionEventListeners.get(event)?.add(listener);
	return () => {
		sessionEventListeners.get(event)?.delete(listener);
	};
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = useState<SessionData>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchSession = useCallback(async (retries = 1) => {
		for (let attempt = 0; attempt < retries; attempt++) {
			try {
				const res = await authClient.getSession();
				if (res.data?.session) {
					setSession({
						success: true,
						data: res.data,
					} as GetSessionResponse);
					setIsLoading(false);
					return;
				}
				// No session found, wait before retry (exponential backoff)
				if (attempt < retries - 1) {
					await new Promise((r) => setTimeout(r, 100 * (attempt + 1)));
				}
			} catch {
				// On error, continue to next retry
				if (attempt < retries - 1) {
					await new Promise((r) => setTimeout(r, 100 * (attempt + 1)));
					continue;
				}
				setSession({
					success: false,
					error: "Failed to fetch session",
				});
				setIsLoading(false);
				return;
			}
		}
		// All retries exhausted with no session
		setSession({
			success: false,
			error: "No session found",
		});
		setIsLoading(false);
	}, []);

	const refetch = useCallback(async () => {
		setIsLoading(true);
		await fetchSession(3);
	}, [fetchSession]);

	const clearSession = useCallback(() => {
		setSession(null);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchSession();
	}, [fetchSession]);

	// Subscribe to session events from auth hooks
	useEffect(() => {
		const unsubscribeRefetch = subscribeToSessionEvent("refetch", () => {
			refetch();
		});
		const unsubscribeClear = subscribeToSessionEvent("clear", () => {
			clearSession();
		});
		return () => {
			unsubscribeRefetch();
			unsubscribeClear();
		};
	}, [refetch, clearSession]);

	const isAuthenticated = useMemo(() => {
		return session !== null && session.success === true;
	}, [session]);

	const user = useMemo(() => {
		if (session?.success) {
			return session.data.user;
		}
		return null;
	}, [session]);

	const value = useMemo(
		() => ({
			session,
			isLoading,
			isAuthenticated,
			user,
			refetch,
			clearSession,
		}),
		[session, isLoading, isAuthenticated, user, refetch, clearSession],
	);

	return (
		<SessionContext.Provider value={value}>{children}</SessionContext.Provider>
	);
}

export function useSession() {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within SessionProvider");
	}
	return context;
}
