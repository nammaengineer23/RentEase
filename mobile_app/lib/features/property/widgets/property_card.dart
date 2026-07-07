import 'package:flutter/material.dart';
import '../domain/entities/property_entity.dart';

class PropertyCard extends StatelessWidget {
  const PropertyCard({super.key, required this.entity});

  final PropertyEntity entity;

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
