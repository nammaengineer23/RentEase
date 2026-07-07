class PropertyEntity {
  const PropertyEntity(
    this.title,
    this.description, {
    required this.price,
    required this.location,
  });

  final String title;
  final String description;
  final String price;
  final String location;
}
