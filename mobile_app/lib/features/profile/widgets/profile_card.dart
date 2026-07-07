import 'package:flutter/material.dart';
import '../domain/entities/profile_entity.dart';

class ProfileCard extends StatelessWidget {
  const ProfileCard({super.key, required this.entity});

  final ProfileEntity entity;

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
