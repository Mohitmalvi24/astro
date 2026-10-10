import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/authStore';
import { AstroLogo } from '../components/AstroLogo';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      await login({ email, password });
    } catch (e) {
      // handled by store
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <AstroLogo size={60} />
          <Text style={styles.title}>Astro</Text>
          <Text style={styles.subtitle}>Welcome back. Sign in to continue.</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) clearError();
              }}
              placeholder="name@example.com"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) clearError();
              }}
              placeholder="••••••••"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchLink}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.switchText}>
              Don't have an account? <Text style={styles.accentText}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 34,
    color: theme.colors.textPrimary,
    marginTop: 12,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  errorContainer: {
    backgroundColor: '#FBE8E4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  errorText: {
    color: theme.colors.accent,
    fontSize: 13,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 11,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 16,
    color: theme.colors.textPrimary,
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.border,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  switchLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  accentText: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});
