import type {TUser} from "@/types";
import {createStore, type StoreApi, useStore} from "zustand";
import {createContext, type PropsWithChildren, useState} from "react";
import {useSafeContext} from "@/hooks";


export interface IAuthStore {
	user: TUser | null;
	setUser: (user: TUser | null) => void;
}

type TAuthContext = StoreApi<IAuthStore>;

interface IAuthProviderProps extends PropsWithChildren {
	initialUser: TUser | null;
}

const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export const AuthProvider = ({ initialUser, children }: IAuthProviderProps) => {
	const [store] = useState(
		createStore<IAuthStore>((set) => ({
			user: initialUser,
			setUser: (user) => set({ user })
		}))
	);

	return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

const defaultSelector = (state: IAuthStore) => state;

export const useAuth = <T = IAuthStore>(selector: (store: IAuthStore) => T = defaultSelector as () => T): T => {
	const context = useSafeContext(AuthContext);
	return useStore(context, selector);
};
