import { VerifyIcon } from '@/assets/icons/verify-icon';
import {
  AccountStatus,
  AccountStatusMap,
  VerifyProfileStatus,
  VerifyProfileStatusMap
} from '@/constants';
import VerificationPatientCard from '@/features/user-detail/components/patient-detail/verification-patient-card';
import type { UserProfilePatient } from '@/features/user-detail/interface';
import Col from '@/shared/components/ui/Col';
import Row from '@/shared/components/ui/Row';
import { Tag } from '@/shared/components/ui/Tag';
import { getStatusColor } from '@/shared/components/ui/Tag/helper';
import { formattedDate } from '@/shared/libs/utils';

interface Props {
  email: string;
  accountStatus?: AccountStatus;
  userProfile: UserProfilePatient;
}

export default function PatientDetail({
  email,
  accountStatus,
  userProfile
}: Props) {
  if (!userProfile) return null;
  return (
    <div className="p-2">
      <div className="mb-6 flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2">
          <h5>{userProfile?.name}</h5>
          {userProfile.status ? (
            <Tag
              color={getStatusColor(userProfile.status)}
              label={VerifyProfileStatusMap[userProfile.status]}
              size="sm"
              variant="filled"
            />
          ) : null}
        </div>
        {accountStatus && accountStatus === AccountStatus.Deleted ? (
          <Tag
            color="white"
            label={AccountStatusMap[accountStatus]}
            size="sm"
            variant="outline"
          />
        ) : null}
      </div>
      {accountStatus && accountStatus === AccountStatus.Deleted ? (
        <div className="mb-6 w-full">
          <p className="text-md font-normal text-text-default">
            The user has requested their account to be deleted. If the user does
            not log in until{' '}
            {formattedDate(
              new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toString()
            )}
            , this user account will be deleted permanently from the system.
          </p>
        </div>
      ) : null}
      <div className="w-full">
        <div className="flex flex-col gap-6">
          {/* Information section */}
          <div className="relative h-fit rounded-lg bg-background-default shadow-sm">
            {accountStatus && accountStatus === AccountStatus.Deleted ? (
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-white opacity-50" />
            ) : null}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <span className="text-xl font-semibold text-text-default">
                Account Information
              </span>
            </div>
            <Row classes="p-6">
              <Col span={4}>
                <div className="flex flex-row items-start gap-3">
                  <div className="aspect-square w-12">
                    <img
                      alt="User Avatar"
                      className="h-12 w-12 rounded-full"
                      src="/anonymous-avatar.png"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-md font-semibold text-text-default">
                      Full name
                    </span>
                    <span className="text-sm font-normal text-text-description">
                      {userProfile?.name}
                    </span>
                  </div>
                </div>
              </Col>

              <Col span={4}>
                <div className="flex flex-row items-start gap-3">
                  <div className="aspect-square w-12 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-md font-semibold text-text-default">
                      Email
                    </span>
                    <span className="break-all text-sm font-normal text-text-description">
                      {email}
                    </span>
                  </div>
                </div>
              </Col>

              <Col span={4}>
                <div className="flex flex-row items-start gap-3">
                  <div className="aspect-square w-12" />
                  <div className="flex flex-col">
                    <span className="text-md font-semibold text-text-default">
                      Role
                    </span>
                    <span className="flex flex-row text-sm font-normal text-text-description">
                      Patient &nbsp;
                      {userProfile?.status === VerifyProfileStatus.Verified ? (
                        <VerifyIcon height="20" />
                      ) : null}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Verified information section*/}
          <VerificationPatientCard
            accountStatus={accountStatus}
            userProfile={userProfile}
          />
        </div>
      </div>
    </div>
  );
}
