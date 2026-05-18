export const getRiskBackgroundColor = (rValue: string): string => {
  const numericScore = Number.parseFloat(rValue.split(' ')[0]);
  if (numericScore >= 0.8) return 'bg-primary-500 text-white';
  if (numericScore >= 0.5) return 'bg-primary-400 text-white';
  if (numericScore >= 0.3) return 'bg-primary-300 text-white';
  return 'bg-primary-200 text-primary-800';
};

export const getRiskLevel = (rValue: number): string => {
  if (rValue >= 0.8) {
    return 'High-risk';
  }

  if (rValue >= 0.5) {
    return 'Medium-risk';
  }

  return 'Low-risk';
};
