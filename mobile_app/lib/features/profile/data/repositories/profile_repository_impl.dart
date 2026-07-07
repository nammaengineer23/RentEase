import '../../domain/entities/profile_entity.dart';
import '../../domain/repositories/profile_repository.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  @override
  Future<List<ProfileEntity>> load() async {
    return [
      ProfileEntity('Track progress', 'Built for RentEase workflows.'),
    ];
  }
}
