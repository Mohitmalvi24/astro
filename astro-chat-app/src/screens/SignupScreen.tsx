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

export const SignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) return;
    try {
      await register({
        email,
        username: username || email.split('@')[0],
        password,
        confirm_password: confirmPassword,
      });
    } catch (e) {
      // handled in store
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <AstroLogo size={50} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Astro to start messaging.</Text>
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
            <Text style={styles.label}>USERNAME (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (error) clearError();
              }}
              placeholder="astronaut"
              placeholderTextColor={theme.colors.textSecondary}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CONFIRM PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) clearError();
              }}
              placeholder="••••••••"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.accentText}>Sign In</Text>
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
    marginBottom: 28,
  },
  title: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 28,
    color: theme.colors.textPrimary,
    marginTop: 10,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#FBE8E4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
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
    marginBottom: 18,
  },
  label: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 11,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 15,
    color: theme.colors.textPrimary,
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.border,
    paddingVertical: 6,
  },
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  switchLink: {
    marginTop: 16,
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
