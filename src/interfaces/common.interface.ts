export interface IToken {
  companyName: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ICommonAuthUtility {
  exp: number;
  iat: number;
  email: string;
}

export interface ICommonFormOptions {
  mode: "all" | "onSubmit" | "onBlur" | "onChange" | "onTouched";
  reValidateMode: "onSubmit" | "onBlur" | "onChange";
  resetOptions: {
    keepDirtyValues?: boolean | undefined;
    keepErrors?: boolean | undefined;
  };
}

export interface IDateRange {
  startDate: Date | null;
  endDate: Date | null;
}
