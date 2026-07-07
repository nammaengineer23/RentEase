import '../entities/property_entity.dart';

abstract class PropertyRepository {
  Future<List<PropertyEntity>> load();
}
