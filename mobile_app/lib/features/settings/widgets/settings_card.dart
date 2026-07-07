import 'package:flutter/material.dart';
import '../domain/entities/settings_entity.dart';

class SettingsCard extends StatelessWidget {
  const SettingsCard({super.key, required this.entity});

  final SettingsEntity entity;

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
