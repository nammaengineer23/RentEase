import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../shared/widgets/primary_button.dart';
import '../../../../routes/app_routes.dart';

class SplashPage extends StatelessWidget {
  const SplashPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.home_work_rounded, size: 72),
              const SizedBox(height: 24),
              Text('RentEase', style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 12),
              Text('Discover, book, and manage premium rental spaces.', textAlign: TextAlign.center, style: Theme.of(context).textTheme.bodyMedium),
              const SizedBox(height: 24),
              PrimaryButton(label: 'Get Started', onPressed: () => context.go(AppRoutes.onboarding)),
            ],
          ),
        ),
      ),
    );
  }
}
