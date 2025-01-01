import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../services/openai/recommendations';
import { useRecommendationsStore } from '../store/useRecommendationsStore';
import type { UserProfile } from '../types/profile';

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setRecommendations } = useRecommendationsStore();

  const handleGetRecommendations = async (profile: UserProfile) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getRecommendations(profile);
      if (!result) {
        throw new Error('No recommendations received');
      }

      setRecommendations(JSON.stringify(result));
      navigate('/recommendations');
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getRecommendations: handleGetRecommendations,
    isLoading,
    error
  };
}