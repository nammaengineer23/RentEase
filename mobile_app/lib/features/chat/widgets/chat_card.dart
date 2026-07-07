import 'package:flutter/material.dart';
import '../domain/entities/chat_entity.dart';

class ChatCard extends StatelessWidget {
  const ChatCard({super.key, required this.entity});

  final ChatEntity entity;

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
