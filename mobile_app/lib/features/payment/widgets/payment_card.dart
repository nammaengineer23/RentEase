import 'package:flutter/material.dart';
import '../domain/entities/payment_entity.dart';

class PaymentCard extends StatelessWidget {
  const PaymentCard({super.key, required this.entity});

  final PaymentEntity entity;

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
