import '../entities/authentication_entity.dart';

abstract class AuthenticationRepository {
  Future<List<AuthenticationEntity>> load();
  Future<bool> signInWithGoogle();
}
