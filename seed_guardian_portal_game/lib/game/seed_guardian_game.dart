import 'package:flame/game.dart';
import 'package:flame/components.dart';
import 'package:flutter/material.dart';

class SeedGuardianGame extends FlameGame {
  late TextComponent scoreText;
  late TextComponent instructionText;
  SpriteComponent? backgroundImage;
  int score = 0;
  
  // Responsive scaling factors
  double get scaleFactor => size.x / 800; // Base width is 800

  @override
  Future<void> onLoad() async {
    super.onLoad();
    
    try {
      // Load and add the background image
      final backgroundSprite = await Sprite.load('backgroundColorGrass.png');
      backgroundImage = SpriteComponent(
        sprite: backgroundSprite,
        size: size, // Use full screen size
        position: Vector2.zero(),
      );
      camera.viewport.add(backgroundImage!);
    } catch (e) {
      // Fallback to blue background if image fails to load
      // Using debugPrint for better logging in development
      debugPrint('Failed to load background image: $e');
      camera.viewport.add(RectangleComponent(
        size: size,
        paint: Paint()..color = const Color(0xFF87CEEB),
      ));
    }
    
    // Add title (responsive font size and position)
    camera.viewport.add(TextComponent(
      text: '🌱 SEED GUARDIAN PORTAL 🌱',
      position: Vector2(size.x / 2, size.y * 0.1), // 10% from top
      anchor: Anchor.center,
      textRenderer: TextPaint(
        style: TextStyle(
          fontSize: 32 * scaleFactor, // Responsive font size
          color: Colors.white,
          fontWeight: FontWeight.bold,
          shadows: const [
            Shadow(
              offset: Offset(2, 2),
              blurRadius: 4,
              color: Colors.black54,
            ),
          ],
        ),
      ),
    ));
    
    // Add score display (responsive position and font size)
    scoreText = TextComponent(
      text: 'Score: $score',
      position: Vector2(size.x * 0.05, size.y * 0.05), // 5% from edges
      anchor: Anchor.topLeft,
      textRenderer: TextPaint(
        style: TextStyle(
          fontSize: 24 * scaleFactor, // Responsive font size
          color: Colors.white,
          fontWeight: FontWeight.bold,
          shadows: const [
            Shadow(
              offset: Offset(1, 1),
              blurRadius: 2,
              color: Colors.black54,
            ),
          ],
        ),
      ),
    );
    camera.viewport.add(scoreText);
    
    // Add instruction text (responsive position and font size)
    instructionText = TextComponent(
      text: 'Welcome to your garden! 🌻',
      position: Vector2(size.x / 2, size.y / 2),
      anchor: Anchor.center,
      textRenderer: TextPaint(
        style: TextStyle(
          fontSize: 28 * scaleFactor, // Responsive font size
          color: Colors.yellow,
          fontWeight: FontWeight.bold,
          shadows: const [
            Shadow(
              offset: Offset(1, 1),
              blurRadius: 2,
              color: Colors.black54,
            ),
          ],
        ),
      ),
    );
    camera.viewport.add(instructionText);
  }
  
  @override
  void onGameResize(Vector2 size) {
    super.onGameResize(size);
    
    // Update background image size when screen resizes
    if (backgroundImage != null && backgroundImage!.isMounted) {
      backgroundImage!.size = size;
    }
  }
}