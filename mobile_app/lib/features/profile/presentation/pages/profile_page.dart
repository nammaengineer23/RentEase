import 'package:flutter/material.dart';
import '../../../../shared/widgets/secondary_button.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(children: [
          Text('Your account', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 16),
          const Text('Keep your preferences, documents, and saved listings organized.'),
          const Spacer(),
          SecondaryButton(label: 'Open Settings', onPressed: () {}),
        ]),
      ),
    );
  }
}
