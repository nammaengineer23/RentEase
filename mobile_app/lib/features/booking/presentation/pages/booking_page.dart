import 'package:flutter/material.dart';
import '../../../../shared/widgets/primary_button.dart';

class BookingPage extends StatelessWidget {
  const BookingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Book a Visit')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(children: [
          Text('Schedule a tour', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 16),
          const Text('Choose a time that works for you and confirm instantly.'),
          const Spacer(),
          PrimaryButton(label: 'Request Visit', onPressed: () {}),
        ]),
      ),
    );
  }
}
