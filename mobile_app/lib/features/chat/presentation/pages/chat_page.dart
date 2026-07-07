import 'package:flutter/material.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final List<String> _messages = <String>[
    'Hi, is the loft still available?',
    'Yes, it is available for viewing this week.',
    'Perfect, I will book a tour.',
  ];

  String _lastMessage = '';

  void _addMessage(String value) {
    final normalized = value.trim();
    if (normalized.isEmpty || normalized == _lastMessage) {
      return;
    }
    setState(() {
      _messages.add(normalized);
      _lastMessage = normalized;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Inbox')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: ListTile(title: Text(_messages[index])),
                );
              },
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: const InputDecoration(
                        hintText: 'Type a message',
                        border: OutlineInputBorder(),
                      ),
                      onSubmitted: _addMessage,
                    ),
                  ),
                  const SizedBox(width: 12),
                  FilledButton(onPressed: () {}, child: const Text('Send')),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
