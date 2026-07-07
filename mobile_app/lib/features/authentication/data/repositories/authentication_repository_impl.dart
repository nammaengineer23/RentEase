import '../../domain/entities/authentication_entity.dart';
import '../../domain/repositories/authentication_repository.dart';
import '../services/google_auth_service.dart';

class AuthenticationRepositoryImpl implements AuthenticationRepository {
  AuthenticationRepositoryImpl({GoogleAuthService? authService})
      : _authService = authService ?? GoogleAuthService();

  final GoogleAuthService _authService;

  @override
  Future<List<AuthenticationEntity>> load() async {
    return [
      const AuthenticationEntity('Track progress', 'Built for RentEase workflows.'),
    ];
  }

  @override
  Future<bool> signInWithGoogle() async {
    final user = await _authService.signInWithGoogle();
    return user != null;
  }
}
