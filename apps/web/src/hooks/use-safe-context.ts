import {type Context, useContext} from "react";

export const useSafeContext = <T>(context: Context<T>, hookName = "useSafeContext"): NonNullable<T> => {
	const contextValue = useContext(context);
	if (!contextValue) {
		throw new Error(`${hookName} must be used within a ${context.displayName || "Provider"} with a value`);
	}
	return contextValue;
};
