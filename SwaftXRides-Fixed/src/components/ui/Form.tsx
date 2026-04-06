// src/components/ui/Form.tsx
// React Native port of form.tsx
// react-hook-form still works in RN — only the render primitives change
// FormProvider, Controller, useFormContext → same API, no changes needed
// Label, Input, error text → RN View/Text/TextInput

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Form = FormProvider (unchanged) ─────────────────────────────────────────

const Form = FormProvider;

// ─── Context ──────────────────────────────────────────────────────────────────

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName };

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

type FormItemContextValue = { id: string };
const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

// ─── FormField ────────────────────────────────────────────────────────────────

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

// ─── useFormField ─────────────────────────────────────────────────────────────

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) throw new Error('useFormField must be used within <FormField>');
  return { id: itemContext.id, name: fieldContext.name, ...fieldState };
}

// ─── FormItem ─────────────────────────────────────────────────────────────────

interface FormItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const FormItem = ({ children, style }: FormItemProps) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[styles.item, style]}>{children}</View>
    </FormItemContext.Provider>
  );
};

// ─── FormLabel ────────────────────────────────────────────────────────────────

interface FormLabelProps {
  children: React.ReactNode;
  style?: TextStyle;
  required?: boolean;
}

const FormLabel = ({ children, style, required }: FormLabelProps) => {
  const { error } = useFormField();
  return (
    <Text style={[styles.label, error && styles.labelError, style]}>
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
};

// ─── FormControl ──────────────────────────────────────────────────────────────
// In RN we just render children — no Slot needed

const FormControl = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// ─── FormDescription ──────────────────────────────────────────────────────────

const FormDescription = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

// ─── FormMessage ──────────────────────────────────────────────────────────────

const FormMessage = ({ children, style }: { children?: React.ReactNode; style?: TextStyle }) => {
  const { error } = useFormField();
  const body = error ? String(error?.message) : children;
  if (!body) return null;
  return <Text style={[styles.message, style]}>{body}</Text>;
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  item: {
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
    lineHeight: 18,
  },
  labelError: {
    color: COLORS.destructive,
  },
  required: {
    color: COLORS.destructive,
  },
  description: {
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 18,
  },
  message: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.destructive,
    lineHeight: 18,
  },
});

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
