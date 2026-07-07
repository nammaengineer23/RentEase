import 'package:flutter/material.dart';
import '../domain/entities/home_entity.dart';

class HomeCard extends StatelessWidget {
  const HomeCard({super.key, required this.entity});

  final HomeEntity entity;

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
