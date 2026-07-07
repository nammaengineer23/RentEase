import 'package:flutter/material.dart';
import '../domain/entities/onboarding_entity.dart';

class OnboardingCard extends StatelessWidget {
  const OnboardingCard({super.key, required this.entity});

  final OnboardingEntity entity;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(entity.title),
        subtitle: Text(entity.description),
      ),
    );
  }
}
