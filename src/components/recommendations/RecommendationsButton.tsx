import React from 'react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from './LoadingSpinner';
import { useOpenAI } from '../../hooks/useOpenAI';
import { useProfileStore } from '../../store/useProfileStore';

export function RecommendationsButton() {
  const { getRecommendations, isLoading, error } = useOpenAI();
  const { basicDetails, spendingHabits, goals } = useProfileStore();

  const handleGetRecommendations = async () => {
    if (!basicDetails || !spendingHabits || goals.length === 0) {
      return;
    }

    await getRecommendations({
      basicDetails,
      spendingHabits,
      goals
    });
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGetRecommendations}
        disabled={isLoading || !basicDetails || !spendingHabits || goals.length === 0}
        className="w-full"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            Getting Recommendations...
          </span>
        ) : (
          'Get Recommendations'
        )}
      </Button>

      {error && (
        <p className="text-sm text-red-500 text-center">
          {error}
        </p>
      )}
    </div>
  );
}