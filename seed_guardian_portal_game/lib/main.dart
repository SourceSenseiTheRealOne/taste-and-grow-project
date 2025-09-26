import 'package:flutter/material.dart';
import 'package:flame/game.dart';
import 'game/seed_guardian_game.dart';

void main() {
  runApp(const SeedGuardianApp());
}

class SeedGuardianApp extends StatelessWidget {
  const SeedGuardianApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Seed Guardian Portal Game',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
      ),
      home: const GameScreen(),
    );
  }
}

class GameScreen extends StatelessWidget {
  const GameScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SizedBox(
        width: double.infinity,
        height: double.infinity,
        child: GameWidget<SeedGuardianGame>.controlled(
          gameFactory: SeedGuardianGame.new,
        ),
      ),
    );
  }
}