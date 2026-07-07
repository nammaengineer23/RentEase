import 'package:flutter/material.dart';
import '../domain/entities/search_entity.dart';

class SearchCard extends StatelessWidget {
  const SearchCard({super.key, required this.entity});

  final SearchEntity entity;

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
