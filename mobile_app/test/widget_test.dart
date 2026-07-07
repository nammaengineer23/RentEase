// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/app.dart';
import 'package:mobile_app/features/authentication/presentation/pages/authentication_page.dart';
import 'package:mobile_app/features/search/data/repositories/search_repository_impl.dart';

void main() {
  testWidgets('RentEase app renders initial screen', (tester) async {
    await tester.pumpWidget(const RentEaseApp());

    expect(find.text('RentEase'), findsOneWidget);
  });

  testWidgets('sign in page exposes Google sign in action', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SignInPage()));

    expect(find.text('Continue with Google'), findsOneWidget);
  });

  test('search repository returns sample results', () async {
    final repository = SearchRepositoryImpl();

    final results = await repository.load();

    expect(results, hasLength(3));
    expect(results.first.title, 'Luxury Apartment');
  });
}
