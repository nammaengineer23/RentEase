import 'package:flutter/material.dart';
import '../domain/entities/authentication_entity.dart';

class AuthenticationCard extends StatelessWidget {
  const AuthenticationCard({super.key, required this.entity});

  final AuthenticationEntity entity;

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
