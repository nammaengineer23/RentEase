import 'package:flutter/material.dart';
import '../../../../shared/widgets/custom_text_field.dart';

class SearchPage extends StatelessWidget {
  const SearchPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Search')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(children: [
          const CustomTextField(label: 'Location', hintText: 'Search by city or area', prefixIcon: Icons.location_on_outlined),
          const SizedBox(height: 16),
          const CustomTextField(label: 'Budget', hintText: 'Set a monthly range', prefixIcon: Icons.attach_money),
        ]),
      ),
    );
  }
}
