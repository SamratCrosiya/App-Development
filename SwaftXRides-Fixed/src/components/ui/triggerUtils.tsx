import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

type TriggerTouchableProps = Omit<TouchableOpacityProps, 'children' | 'style'> & {
  style?: StyleProp<ViewStyle>;
};

const chainHandlers = <Args extends unknown[]>(
  ...handlers: Array<((...args: Args) => void) | undefined>
) => {
  const activeHandlers = handlers.filter(Boolean) as Array<(...args: Args) => void>;
  if (activeHandlers.length === 0) {
    return undefined;
  }

  return (...args: Args) => {
    activeHandlers.forEach((handler) => handler(...args));
  };
};

export function renderTriggerTouchable(
  children: React.ReactNode,
  props: TriggerTouchableProps
) {
  if (
    React.isValidElement(children) &&
    typeof children.type !== 'string' &&
    children.type !== React.Fragment
  ) {
    const child = children as React.ReactElement<Record<string, any>>;
    const childProps = child.props ?? {};
    const mergedDisabled = Boolean(props.disabled || childProps.disabled);

    return React.cloneElement(child, {
      ...childProps,
      ...props,
      disabled: mergedDisabled,
      style: [childProps.style, props.style],
      onPress: chainHandlers(childProps.onPress, props.onPress),
      onLongPress: chainHandlers(childProps.onLongPress, props.onLongPress),
      onPressOut: chainHandlers(childProps.onPressOut, props.onPressOut),
      activeOpacity: props.activeOpacity ?? childProps.activeOpacity,
      delayLongPress: props.delayLongPress ?? childProps.delayLongPress,
    });
  }

  return <TouchableOpacity {...props}>{children}</TouchableOpacity>;
}
