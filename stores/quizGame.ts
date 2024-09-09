import { create } from 'zustand';
import { IQA } from '~/lib/interfaces';

interface QuizGameStore {
  isPlay: boolean;
  isWaiting: boolean;
  isFinish: boolean;
  numPlayers: number;
  currentQuestion: IQA | null;
  questionIndex: number;
  userAnswer: number | null;
  isCorrect: boolean | null;
  isShowAnswer: boolean;
  score: number;
  setIsPlay: (isPlay: boolean) => void;
  setIsWaiting: (isWaiting: boolean) => void;
  setIsFinish: (isFinish: boolean) => void;
  setNumPlayers: (update: (numPlayers: number) => number) => void;
  setCurrentQuestion: (currentQuestion: IQA) => void;
  setQuestionIndex: (questionIndex: number) => void;
  setUserAnswer: (userAnswer: number | null) => void;
  setIsCorrect: (isCorrect: boolean | null) => void;
  setIsShowAnswer: (isShowAnswer: boolean) => void;
  setScore: (score: number) => void;
  incrementScore: () => void;
  decrementScore: () => void;
  resetGame: () => void;
}

const useQuizGameStore = create<QuizGameStore>((set, get) => ({
  isPlay: false,
  isFinish: false,
  isWaiting: true,
  numPlayers: 0,
  currentQuestion: null,
  questionIndex: 0,
  userAnswer: null,
  isCorrect: null,
  isShowAnswer: false,
  score: 0,
  setIsPlay: (isPlay) => set({ isPlay }),
  setIsWaiting: (isWaiting) => set({ isWaiting }),
  setIsFinish: (isFinish) => set({ isFinish }),
  setNumPlayers: (update) => set((state) => ({ numPlayers: update(state.numPlayers) })),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setQuestionIndex: (questionIndex) => set({ questionIndex }),
  setUserAnswer: (userAnswer) => set({ userAnswer }),
  setIsCorrect: (isCorrect) => set({ isCorrect }),
  setIsShowAnswer: (isShowAnswer) => set({ isShowAnswer }),
  setScore: (score) => set({ score }),
  incrementScore: () => set((state) => ({ score: state.score + 20 })),
  decrementScore: () => set((state) => ({ score: state.score - 1 })),
  resetGame: () =>
    set({
      isPlay: false,
      isWaiting: true,
      isFinish: false,
      numPlayers: 0,
      currentQuestion: null,
      questionIndex: 0,
      userAnswer: null,
      isCorrect: null,
      isShowAnswer: false,
      score: 0,
    }),
}));

export default useQuizGameStore;
