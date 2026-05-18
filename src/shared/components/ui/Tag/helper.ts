import { GenderType, VerifyProfileStatus } from '@/constants';

export const getStatusColor = (status?: string) => {
  switch (status) {
    case VerifyProfileStatus.Verified:
    case GenderType.Nam:
      return 'green';

    case GenderType.Nữ:
    case VerifyProfileStatus.WaitingForApproval:
      return 'yellow';

    case VerifyProfileStatus.Reject:
      return 'red';
    case VerifyProfileStatus.Unverified:
    default:
      return 'gray';
  }
};
