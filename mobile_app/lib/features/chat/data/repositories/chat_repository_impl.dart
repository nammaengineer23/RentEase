import '../../domain/entities/chat_entity.dart';
import '../../domain/repositories/chat_repository.dart';

class ChatRepositoryImpl implements ChatRepository {
  @override
  Future<List<ChatEntity>> load() async {
    return [
      ChatEntity('Track progress', 'Built for RentEase workflows.'),
    ];
  }
}
