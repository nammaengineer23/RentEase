import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../shared/widgets/primary_button.dart';
import '../../../../routes/app_routes.dart';

class OnboardingPage extends StatelessWidget {
  const OnboardingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Welcome')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Find the right space faster', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 12),
            Text('RentEase helps you search, compare, and book listings with confidence.', style: Theme.of(context).textTheme.bodyMedium),
            const Spacer(),
            PrimaryButton(label: 'Continue', onPressed: () => context.go(AppRoutes.signIn)),
          ],
        ),
      ),
    );
  }
}
