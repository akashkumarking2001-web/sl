import { useState } from "react";
import { X, CheckCircle, XCircle, Award, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface CourseQuizProps {
  courseTitle: string;
  questions: Question[];
  passingScore: number; // percentage
  onPass: () => void;
  onClose: () => void;
}

const CourseQuiz = ({ courseTitle, questions, passingScore, onPass, onClose }: CourseQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const question = questions[currentQuestion];
  const hasAnswered = selectedAnswers[currentQuestion] !== -1;

  const handleSelectAnswer = (optionIndex: number) => {
    if (hasAnswered) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
    setShowAnswer(true);
  };

  const handleNext = () => {
    setShowAnswer(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const correct = selectedAnswers.reduce((acc, answer, idx) => {
      return acc + (answer === questions[idx].correctIndex ? 1 : 0);
    }, 0);
    return Math.round((correct / questions.length) * 100);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowResults(false);
    setShowAnswer(false);
  };

  const score = calculateScore();
  const passed = score >= passingScore;

  if (showResults) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm">
        <div className="glass-card max-w-md w-full rounded-3xl p-8 text-center animate-scale-in">
          {passed ? (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center shadow-lg">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold font-display mb-2">Congratulations! 🎉</h2>
              <p className="text-muted-foreground mb-4">
                You passed the assessment with a score of <span className="text-emerald font-bold">{score}%</span>!
              </p>
              <div className="glass-card p-4 rounded-xl mb-6 bg-emerald/10 border border-emerald/20">
                <p className="text-sm text-emerald font-medium">
                  Your certificate is being generated...
                </p>
              </div>
              <Button variant="hero" onClick={onPass} className="w-full">
                <Award className="w-4 h-4 mr-2" />
                Claim Your Certificate
              </Button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-destructive to-red-400 flex items-center justify-center shadow-lg">
                <XCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold font-display mb-2">Keep Learning! 📚</h2>
              <p className="text-muted-foreground mb-4">
                You scored <span className="text-destructive font-bold">{score}%</span>. 
                You need at least {passingScore}% to pass.
              </p>
              <div className="glass-card p-4 rounded-xl mb-6 bg-primary/10 border border-primary/20">
                <p className="text-sm text-primary font-medium">
                  Review the course materials and try again!
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Review Course
                </Button>
                <Button variant="hero" onClick={handleRetry} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry Quiz
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm">
      <div className="glass-card max-w-2xl w-full rounded-3xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-bold font-display">Course Assessment</h2>
            <p className="text-sm text-muted-foreground">{courseTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 bg-muted/30">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-gold rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-lg font-bold mb-6">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestion] === idx;
              const isCorrect = idx === question.correctIndex;
              const showCorrectness = showAnswer && isSelected;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showAnswer && isCorrect
                      ? 'border-emerald bg-emerald/10'
                      : showCorrectness && !isCorrect
                        ? 'border-destructive bg-destructive/10'
                        : isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  } ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      showAnswer && isCorrect
                        ? 'bg-emerald text-white'
                        : showCorrectness && !isCorrect
                          ? 'bg-destructive text-white'
                          : isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                    }`}>
                      {showAnswer && isCorrect ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : showCorrectness && !isCorrect ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <span className="font-medium">{String.fromCharCode(65 + idx)}</span>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showAnswer && (
            <div className={`mt-4 p-4 rounded-xl ${
              selectedAnswers[currentQuestion] === question.correctIndex
                ? 'bg-emerald/10 border border-emerald/20'
                : 'bg-destructive/10 border border-destructive/20'
            }`}>
              <p className={`font-medium ${
                selectedAnswers[currentQuestion] === question.correctIndex
                  ? 'text-emerald'
                  : 'text-destructive'
              }`}>
                {selectedAnswers[currentQuestion] === question.correctIndex
                  ? '✓ Correct!'
                  : `✗ Incorrect. The correct answer is: ${question.options[question.correctIndex]}`
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end">
          <Button 
            variant="hero" 
            onClick={handleNext}
            disabled={!hasAnswered}
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Finish Quiz
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseQuiz;
