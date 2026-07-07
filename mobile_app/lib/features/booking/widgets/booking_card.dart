import 'package:flutter/material.dart';
import '../domain/entities/booking_entity.dart';

class BookingCard extends StatelessWidget {
  const BookingCard({super.key, required this.entity});

  final BookingEntity entity;

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
