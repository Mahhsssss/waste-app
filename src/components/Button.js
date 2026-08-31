import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors, radius, spacing } from '../globalStyles';

/**
 * EcoShift Standard Button Component
 * Supports: 'primary' | 'secondary' | 'text' | 'pill'
 */
export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'text' | 'pill'
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles[`${variant}Pressed`],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.primary600}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.textBase,
              styles[`${variant}Text`],
              disabled && styles.disabledText,
              icon && styles.textWithIcon,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  textBase: {
    fontSize: 16,
    fontWeight: '600',
  },
  textWithIcon: {
    marginLeft: spacing.sm,
  },

  // Primary Variant
  primary: {
    backgroundColor: colors.primary600,
    shadowColor: colors.primary800,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryPressed: {
    backgroundColor: colors.primary800,
  },
  primaryText: {
    color: colors.white,
  },

  // Secondary Variant (Outline)
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary600,
    height: 50,
  },
  secondaryPressed: {
    backgroundColor: colors.primary50,
  },
  secondaryText: {
    color: colors.primary700,
  },

  // Text / Ghost Variant
  text: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  textPressed: {
    opacity: 0.6,
  },
  textText: {
    color: colors.primary700,
    fontSize: 14,
    fontWeight: '600',
  },

  // Pill Variant
  pill: {
    backgroundColor: colors.cardBg,
    height: 54,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pillPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  pillText: {
    color: colors.textPrimary,
  },

  // Disabled State
  disabled: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: colors.placeholder,
  },
});
