import React, { useReducer, useContext, createContext, useMemo } from "react";

type State = {
    [x: string]: string | boolean;
};

type Actions = {
    setIsAuthenticating: (value: boolean) => void;
    setAuthenticated: (value: boolean) => void;
    setEmail: (value: string) => void;
    setUserType: (value: string) => void;
};

const INIT_STATE = {
    isAuthenticating: true,
    authenticated: false,
    email: "",
    userType: "",
};

const AuthContext = createContext<[State, Actions]>([
    INIT_STATE,
    {
        setIsAuthenticating: (_value: boolean) => { },
        setAuthenticated: (_value: boolean) => { },
        setEmail: (_value: string) => { },
        setUserType: (_value: string) => {},
    },
]);

AuthContext.displayName = "AuthContext";

function reducer(state: object, { type, payload }: { type: string; payload: string | boolean }) {
  return {
    ...state,
    [type]: payload,
  };
}

type ProviderProps = {
    children: React.ReactNode;
  };
  
  const AuthContextProvider = (props: ProviderProps) => {
    const [state, dispatch] = useReducer(reducer, INIT_STATE);
  
    const setIsAuthenticating = (value: boolean): void => dispatch({ type: "isAuthenticating", payload: value });
    const setAuthenticated = (value: boolean): void => dispatch({ type: "authenticated", payload: value });
    const setEmail = (value: string): void => dispatch({ type: "email", payload: value });
    const setUserType = (value: string): void => dispatch({ type: 'userType', payload: value});
  
    return (
      <AuthContext.Provider
        value={useMemo(
          () => [
            state,
            {
              setAuthenticated,
              setIsAuthenticating,
              setEmail,
              setUserType
            },
          ],
          [state],
        )}
      >
        {props.children}
      </AuthContext.Provider>
    );
  };
  
  const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
  };
  
  export { AuthContextProvider, useAuthContext };