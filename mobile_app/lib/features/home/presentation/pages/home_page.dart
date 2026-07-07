import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/app_colors.dart';
import '../../../../routes/app_routes.dart';
import '../../../../shared/widgets/primary_button.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      ('Search Properties', Icons.search, AppRoutes.search),
      ('Book a Visit', Icons.event_available, AppRoutes.booking),
      ('Payments', Icons.payments_outlined, AppRoutes.payment),
      ('Profile', Icons.person_outline, AppRoutes.profile),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(24)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Welcome back', style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.white)),
                  const SizedBox(height: 8),
                  const Text('Manage rentals, tours, and payouts from one place.', style: TextStyle(color: Colors.white70)),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: GridView.builder(
                itemCount: items.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12),
                itemBuilder: (context, index) {
                  final (title, icon, route) = items[index];
                  return Card(
                    child: InkWell(
                      onTap: () => context.go(route),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(icon, size: 28, color: AppColors.primary),
                            const SizedBox(height: 8),
                            Text(title, textAlign: TextAlign.center, style: Theme.of(context).textTheme.titleMedium),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            PrimaryButton(label: 'Open Marketplace', onPressed: () => context.go(AppRoutes.property)),
          ],
        ),
      ),
    );
  }
}
