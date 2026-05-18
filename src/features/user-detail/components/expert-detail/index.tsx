import { AgeIcon } from '@/assets/icons/age-icon';
import BioIcon from '@/assets/icons/bio-icon';
import BusinessRoleIcon from '@/assets/icons/business-role-icon';
import { GenderIcon } from '@/assets/icons/gender-icon';
import { GenreItemIcon } from '@/assets/icons/genre-item-icon';
import { LocationIcon } from '@/assets/icons/location-icon';
import MajorIndustryIcon from '@/assets/icons/major-industry-icon';
import { VerifyIcon } from '@/assets/icons/verify-icon';
import {
  AccountStatus,
  AccountStatusMap,
  VerifyProfileStatus,
  VerifyProfileStatusMap
} from '@/constants';
import VerificationExpertCard from '@/features/user-detail/components/expert-detail/verification-expert-card';
import type { UserProfileExpert } from '@/features/user-detail/interface';
import DescriptionItem from '@/shared/components/blocks/DescriptionItem';
import Col from '@/shared/components/ui/Col';
import Row from '@/shared/components/ui/Row';
import { Tag } from '@/shared/components/ui/Tag';
import { getStatusColor } from '@/shared/components/ui/Tag/helper';
import { formattedDate } from '@/shared/libs/utils';

interface Props {
  email: string;
  accountStatus?: AccountStatus;
  userProfile?: UserProfileExpert;
}

export default function ExpertDetail({
  email,
  accountStatus,
  userProfile
}: Props) {
  if (!userProfile) return null;
  return (
    <div className="p-2">
      <div className="mb-6 flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2">
          <h5 className="flex flex-row gap-2">{userProfile?.name}</h5>
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
                      src={
                        userProfile?.profilePicture || '/anonymous-avatar.png'
                      }
                      alt="User Avatar"
                      className="h-12 w-12 rounded-full object-cover"
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
                      Expert &nbsp;
                      {userProfile?.status === VerifyProfileStatus.Verified ? (
                        <VerifyIcon height="20" />
                      ) : null}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          {/* Basic Information Section */}
          <div className="relative flex w-full flex-col rounded-2xl bg-background-default">
            {accountStatus && accountStatus === AccountStatus.Deleted ? (
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-white opacity-50" />
            ) : null}
            <div className="flex flex-row items-center justify-between border-b px-6 py-4">
              <span className="text-xl font-semibold text-text-default">
                Basic Information
              </span>
            </div>
            <Row classes="p-6">
              <Col span={4}>
                <div className="flex flex-row items-center gap-3">
                  <div className="aspect-square w-8">
                    <GenderIcon className="rounded-md bg-[#F8F8F7]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-normal text-text-subtle">
                      Sex
                    </span>
                    <span className="text-sm font-normal text-text-default">
                      {userProfile?.sex}
                    </span>
                  </div>
                </div>
              </Col>

              <Col span={4}>
                <div className="flex flex-row items-center gap-3">
                  <div className="aspect-square w-8">
                    <AgeIcon className="rounded-md bg-[#F8F8F7]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-normal text-text-subtle">
                      Date of birth
                    </span>
                    <span className="text-sm font-normal text-text-default">
                      {formattedDate(
                        userProfile?.dob ? userProfile.dob.toString() : ''
                      )}
                    </span>
                  </div>
                </div>
              </Col>

              <Col span={4}>
                <div className="flex flex-row items-center gap-3">
                  <div className="aspect-square w-8">
                    <LocationIcon className="rounded-md bg-[#F8F8F7]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-normal text-text-subtle">
                      Country
                    </span>
                    <span className="text-sm font-normal text-text-default">
                      {userProfile?.country}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          {/* Professional information section */}
          <div className="relative w-full rounded-2xl bg-background-default">
            {accountStatus && accountStatus === AccountStatus.Deleted ? (
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-white opacity-50" />
            ) : null}
            <div className="flex flex-col gap-1">
              <div className="flex w-full items-center justify-between border-b px-6 py-4">
                <span className="text-lg font-bold text-text-default">
                  Professional information
                </span>
              </div>
              <div className="flex flex-col gap-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <DescriptionItem
                    description={userProfile?.organization || ''}
                    icon={<MajorIndustryIcon />}
                    title="Hospital/ Organisation affiliation:"
                  />
                  <DescriptionItem
                    description={userProfile?.countryOfOrganization || ''}
                    icon={<LocationIcon />}
                    title="Country of Hospital/ Organisation:"
                  />
                  <DescriptionItem
                    description={userProfile?.department || ''}
                    icon={<MajorIndustryIcon />}
                    title="Department:"
                  />
                  <DescriptionItem
                    description={userProfile?.position || ''}
                    icon={<BusinessRoleIcon />}
                    title="Position:"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <DescriptionItem
                    description={
                      userProfile?.diseaseExpIn
                        ? userProfile?.diseaseExpIn
                            ?.map((disease) => disease.name)
                            .join(', ')
                        : 'Not available'
                    }
                    icon={<GenreItemIcon />}
                    title="Rare diseases experience in:"
                  />
                  {userProfile?.bioDescription ? (
                    <DescriptionItem
                      description={userProfile?.bioDescription || ''}
                      icon={<BioIcon />}
                      title="Bio description:"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {/* Verified information section*/}
          <VerificationExpertCard
            accountStatus={accountStatus}
            userProfile={userProfile}
          />
        </div>
      </div>
    </div>
  );
}
