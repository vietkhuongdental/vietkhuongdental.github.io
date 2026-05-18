import { GenderType, VerifyProfileStatus } from '@/constants';

export const getStatusColor = (status?: string) => {
  switch (status) {
    case VerifyProfileStatus.Verified:
    case GenderType.MALE:
      return 'green';

    case GenderType.FEMALE:
    case VerifyProfileStatus.WaitingForApproval:
      return 'yellow';

    case VerifyProfileStatus.Reject:
      return 'red';
    case VerifyProfileStatus.Unverified:
    default:
      return 'gray';
  }
};
