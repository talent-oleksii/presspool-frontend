import { PropsWithChildren } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

interface IFormProviderWrapper {
  methods: UseFormReturn<any, any, FieldValues>;
  onSubmit: (values: FieldValues) => Promise<void> | void;
}

const FormProviderWrapper = ({
  methods,
  onSubmit,
  children,
}: PropsWithChildren<IFormProviderWrapper>) => {
  return (
    <FormProvider {...methods}>
      <form autoComplete="off" onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default FormProviderWrapper;
