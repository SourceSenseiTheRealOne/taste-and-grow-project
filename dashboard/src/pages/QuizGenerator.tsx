import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Users,
  Target,
  BookOpen,
  RefreshCw
} from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  title: string;
  description: string;
  questions: QuizQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: string;
  topic: string;
}

const QuizGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Form state
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState('5-8');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const generateQuiz = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for the quiz');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setQuizData(null);
    setSelectedAnswers([]);
    setShowResults(false);

    try {
      const response = await fetch('http://localhost:3001/chatgpt/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          ageGroup,
          difficulty
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setQuizData(data);
      setSelectedAnswers(new Array(data.questions.length).fill(-1));
      setSuccess('Quiz generated successfully!');
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      
      // Check for specific CORS error
      if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
        setError('CORS Error: Unable to connect to the API server. Please make sure the API is running on port 3001 and CORS is properly configured.');
      } else if (err.message.includes('ECONNREFUSED')) {
        setError('Connection Error: Unable to connect to the API server. Please make sure the API is running on port 3001.');
      } else {
        setError(`Failed to generate quiz: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuizData(null);
    setSelectedAnswers([]);
    setShowResults(false);
    setError('');
    setSuccess('');
  };

  const getScore = () => {
    if (!quizData) return 0;
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success/10 text-success border-success/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'hard':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            Quiz Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate educational quizzes for children using AI
          </p>
        </div>
        {quizData && (
          <Button
            variant="outline"
            onClick={resetQuiz}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New Quiz
          </Button>
        )}
      </div>

      {/* Generation Form */}
      {!quizData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Quiz Parameters
            </CardTitle>
            <CardDescription>
              Enter the details for your quiz and let AI generate educational content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Strawberries, Apples, Vegetables"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Age Group</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-8">5-8 years</SelectItem>
                    <SelectItem value="8-12">8-12 years</SelectItem>
                    <SelectItem value="12+">12+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generateQuiz}
              disabled={loading || !topic.trim()}
              className="w-full bg-gradient-primary text-primary-foreground hover:bg-primary-light"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-success bg-success/10 text-success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Quiz Display */}
      {quizData && (
        <div className="space-y-6">
          {/* Quiz Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{quizData.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {quizData.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(quizData.difficulty)}>
                    {quizData.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {quizData.ageGroup} years
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Questions */}
          <div className="space-y-4">
            {quizData.questions.map((question, questionIndex) => (
              <Card key={questionIndex} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {questionIndex + 1}
                    </span>
                    {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Answer Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswers[questionIndex] === optionIndex;
                      const isCorrect = optionIndex === question.correctAnswer;
                      const isWrong = showResults && isSelected && !isCorrect;
                      
                      return (
                        <button
                          key={optionIndex}
                          onClick={() => !showResults && handleAnswerSelect(questionIndex, optionIndex)}
                          disabled={showResults}
                          className={`p-3 text-left rounded-lg border transition-all ${
                            showResults
                              ? isCorrect
                                ? 'bg-success/10 border-success text-success'
                                : isWrong
                                ? 'bg-destructive/10 border-destructive text-destructive'
                                : 'bg-muted/50 border-muted text-muted-foreground'
                              : isSelected
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'hover:bg-card-secondary border-border'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              showResults
                                ? isCorrect
                                  ? 'border-success bg-success text-white'
                                  : isWrong
                                  ? 'border-destructive bg-destructive text-white'
                                  : 'border-muted'
                                : isSelected
                                ? 'border-primary bg-primary text-white'
                                : 'border-border'
                            }`}>
                              {showResults ? (
                                isCorrect ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : isWrong ? (
                                  <XCircle className="w-3 h-3" />
                                ) : null
                              ) : (
                                <span className="text-xs font-medium">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                              )}
                            </div>
                            <span className="flex-1">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showResults && (
                    <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-accent mb-1">Explanation:</p>
                          <p className="text-sm text-foreground">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quiz Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Questions answered: {selectedAnswers.filter(answer => answer !== -1).length} / {quizData.questions.length}
                  </span>
                  {showResults && (
                    <span className={`text-sm font-medium ${getScoreColor(getScore(), quizData.questions.length)}`}>
                      Score: {getScore()} / {quizData.questions.length}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!showResults ? (
                    <Button
                      onClick={submitQuiz}
                      disabled={selectedAnswers.some(answer => answer === -1)}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      onClick={resetQuiz}
                      variant="outline"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
