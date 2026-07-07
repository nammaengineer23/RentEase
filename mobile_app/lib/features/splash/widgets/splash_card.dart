import 'package:flutter/material.dart';
import '../domain/entities/splash_entity.dart';

class SplashCard extends StatelessWidget {
  const SplashCard({super.key, required this.entity});

  final SplashEntity entity;

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
