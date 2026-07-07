import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/entities/chat_entity.dart';
import '../domain/repositories/chat_repository.dart';
import '../data/repositories/chat_repository_impl.dart';

final _repositoryProvider = Provider<ChatRepository>((ref) => ChatRepositoryImpl());

final ChatProvider = FutureProvider<List<ChatEntity>>((ref) async {
  final repository = ref.read(_repositoryProvider);
  return repository.load();
});
