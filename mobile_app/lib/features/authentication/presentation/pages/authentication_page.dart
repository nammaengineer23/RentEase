import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../routes/app_routes.dart';
import '../../../../shared/widgets/custom_text_field.dart';
import '../../../../shared/widgets/primary_button.dart';
import '../../providers/authentication_provider.dart';

class SignInPage extends ConsumerStatefulWidget {
  const SignInPage({super.key});

  @override
  ConsumerState<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends ConsumerState<SignInPage> {
  bool _isSigningIn = false;
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleContinue() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter an email and password.')),
      );
      return;
    }

    context.go(AppRoutes.home);
  }

  Future<void> _handleGoogleSignIn() async {
    setState(() => _isSigningIn = true);
    try {
      final success = await ref.read(signInWithGoogleProvider('google').future);
      if (!mounted) {
        return;
      }
      if (success) {
        context.go(AppRoutes.home);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Google sign-in was cancelled.')),
        );
      }
    } catch (error) {
      if (!mounted) {
        return;
      }
      final message = error is FirebaseAuthException
          ? error.message ?? 'Google sign-in failed.'
          : error.toString();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
    } finally {
      if (mounted) {
        setState(() => _isSigningIn = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign In')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            CustomTextField(
              label: 'Email',
              hintText: 'you@example.com',
              prefixIcon: Icons.email_outlined,
              controller: _emailController,
            ),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Password',
              hintText: 'Enter your password',
              obscureText: true,
              prefixIcon: Icons.lock_outline,
              controller: _passwordController,
            ),
            const SizedBox(height: 24),
            PrimaryButton(label: 'Continue', onPressed: _handleContinue),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: _isSigningIn ? null : _handleGoogleSignIn,
                icon: _isSigningIn
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.g_mobiledata_outlined),
                label: Text(_isSigningIn ? 'Signing in…' : 'Continue with Google'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
