/* eslint-disable no-console */
import { DislikeIcon } from '@/assets/icons/dislike-icon';
import { LikeIcon } from '@/assets/icons/like-icon';
import { NotSureIcon } from '@/assets/icons/not-sure-icon';
// import { ConnectionStatus } from '@/features/connection/common/helpers';
import type { VotePayload } from '@/features/health-record/interface';
import { Button } from '@/shared/components/ui/Button';
import { useModalProvider } from '@/shared/hooks';
import { type PotentialDisease, VoteType } from '@/shared/interface';
import { cn } from '@/shared/libs/utils';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  disease: PotentialDisease;
  index: number;
  connectionStatus?: string;
  onVote?: (voteBody: VotePayload) => Promise<PotentialDisease>;
}

export default function DiseaseCard({
  disease,
  index,
  connectionStatus,
  onVote
}: Props) {
  console.log('connectionStatus :>> ', connectionStatus);
  const navigate = useNavigate();
  const { onCloseAllModals } = useModalProvider();

  const [initDisease, setInitDisease] = useState(disease);
  const handleClickCard = useCallback(() => {
    if (!initDisease.orphaCode) return;
    onCloseAllModals();
    navigate(
      '/disease-detail/:orphaCode?score=:score'
        .replace(':orphaCode', initDisease.orphaCode)
        .replace(':score', Math.abs(+initDisease.confidence).toFixed(4))
    );
  }, [initDisease.orphaCode, initDisease.confidence]);

  const handleVote = useCallback(
    async (data: VotePayload) => {
      if (!onVote) return;

      try {
        const response = await onVote({
          ...data,
          orphaCode: initDisease.orphaCode
        });

        setInitDisease((prev) => ({
          ...prev,
          agreeCount: response.agreeCount,
          disagreeCount: response.disagreeCount,
          notSureCount: response.notSureCount,
          currentUserVote: response.currentUserVote
        }));
      } catch (error) {
        console.error('Vote submission failed:', error);
        throw error;
      }
    },
    [onVote, initDisease.orphaCode, setInitDisease]
  );

  return (
    <label
      className={cn(
        'border-t border-border-default p-6 hover:border hover:border-border-brand-primary-hover',
        'cursor-pointer bg-background-default transition-colors',
        'flex flex-col gap-3'
      )}
      htmlFor="disease"
    >
      <div
        className="flex flex-col justify-between gap-3 md:flex-row"
        onClick={handleClickCard}
      >
        <div className="flex w-full flex-row items-start gap-3">
          <span className="flex aspect-square h-7 items-center justify-center rounded-sm border border-border-default text-lg font-semibold">
            {index}
          </span>
          <div className="flex w-full flex-col gap-2 border-b border-border-subtle">
            <span className="text-md font-semibold text-text-default group-hover:text-text-brand-primary">
              {initDisease.name}
            </span>
            <p className="pb-4 text-sm font-normal text-text-description">
              {initDisease.description}
            </p>
          </div>
        </div>

        {/* Score Card */}
        <div className="flex h-full w-full justify-center md:w-fit">
          <div className="flex h-14 w-24 flex-col items-center justify-center rounded-lg bg-button-risk-bg-high">
            <span className="text-xs font-normal">Risk score</span>
            <span className="text-md font-semibold">
              {Math.abs(+initDisease.confidence) < 0.0001
                ? '<0.0001'
                : Math.abs(+initDisease.confidence).toFixed(4)}{' '}
              R
            </span>
          </div>
        </div>
      </div>

      {/* Review expert */}
      <div className="flex flex-col items-center gap-2 px-10 md:flex-row">
        <span className="w-fit whitespace-nowrap text-sm font-normal text-text-subtle">
          Expert review
        </span>
        <div className="flex flex-col gap-2 md:flex-row">
          <Button
            leadingIcon={
              <LikeIcon
                isFilled={initDisease.currentUserVote === VoteType.AGREE}
              />
            }
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleVote({ vote: VoteType.AGREE });
            }}
            // isDisabled={!onVote || connectionStatus !== ConnectionStatus.ACTIVE}
            size="sm"
            variant="ghost"
          >
            Agree ({initDisease.agreeCount || 0})
          </Button>
          <Button
            leadingIcon={
              <DislikeIcon
                isFilled={initDisease.currentUserVote === VoteType.DISAGREE}
              />
            }
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleVote({
                vote: VoteType.DISAGREE
              });
            }}
            // isDisabled={!onVote || connectionStatus !== Connectio`nStatus.ACTIVE}
            size="sm"
            variant="ghost"
          >
            Disagree ({initDisease.disagreeCount || 0})
          </Button>
          <Button
            leadingIcon={
              <NotSureIcon
                isFilled={initDisease.currentUserVote === VoteType.NOT_SURE}
              />
            }
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleVote({
                vote: VoteType.NOT_SURE
              });
            }}
            // isDisabled={!onVote || connectionStatus !== ConnectionStatus.ACTIVE}
            size="sm"
            variant="ghost"
          >
            Not sure ({initDisease.notSureCount || 0})
          </Button>
        </div>
      </div>
    </label>
  );
}
